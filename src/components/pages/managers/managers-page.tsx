import { useState, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Search, Trash2, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/layouts/dashboard-layout"
import { AppButton } from "@/components/controls/app-button"
import { TextField } from "@/components/controls/text-field"
import { AppModal } from "@/components/controls/AppModal"
import { AppConfirmationModal } from "@/components/controls/app-confirmation-modal"
import { AppAlert } from "@/components/controls/app-alert"
import { DataTable } from "@/components/controls/DataTable"
import { useGetManagers, useRegisterManager, useDeleteUser } from "@/hooks/api/authAPIHooks"
import { useDebounce } from "@/hooks/useDebounce"
import { Manager } from "@/types/auth"
import { AppPagination } from "@/components/controls/AppPagination"

// ---------------------------------------------------------------------------
// Form Validation Schema
// ---------------------------------------------------------------------------
const createManagerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type CreateManagerFormValues = z.infer<typeof createManagerSchema>

// ---------------------------------------------------------------------------
// Theme class helpers
// ---------------------------------------------------------------------------
function cardClass(isLight: boolean, extra = "") {
  return cn(
    "rounded-2xl border p-6",
    isLight ? "bg-white border-[#0A2463]/5 shadow-sm" : "bg-black border-white/10",
    extra
  )
}

function labelClass(isLight: boolean, muted = false) {
  if (muted) return isLight ? "text-[#0A2463]/50" : "text-white/50"
  return isLight ? "text-[#0A2463]" : "text-white"
}

export default function ManagersPage() {
  const { theme } = useTheme()
  const isLight = theme === "light"

  // Page, search, and modal states
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null)
  
  // Custom local toast notification state
  const [notification, setNotification] = useState<{ variant: "success" | "error"; message: string } | null>(null)

  const showNotification = (variant: "success" | "error", message: string) => {
    setNotification({ variant, message })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CreateManagerFormValues>({
    resolver: zodResolver(createManagerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // API Hooks
  const { data: managersData, isLoading, isError, error: fetchError } = useGetManagers({
    page,
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  })

  const { mutate: createManager, isPending: isCreating } = useRegisterManager()
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()

  // Parse managers lists
  const managersList = useMemo(() => {
    if (managersData?.managers && Array.isArray(managersData.managers)) {
      return managersData.managers
    }
    return []
  }, [managersData])

  const totalPages = useMemo(() => {
    // 1. Try direct totalPages
    if (managersData?.totalPages) return Number(managersData.totalPages);
    
    // 2. Try totalCount
    if (managersData?.totalCount) return Math.ceil(Number(managersData.totalCount) / limit);
    
    // 3. Try total (standard in many frameworks)
    // @ts-ignore - support potential undeclared backend fields safely
    if (managersData?.total) return Math.ceil(Number(managersData.total) / limit);
    
    // 4. Try count
    // @ts-ignore - support potential undeclared backend fields safely
    if (managersData?.count) return Math.ceil(Number(managersData.count) / limit);
    
    return 1;
  }, [managersData, limit])

  // Columns definition for DataTable
  const columns = useMemo(() => [
    {
      name: "Name",
      selector: (row: Manager) => row.name,
      sortable: true,
      cell: (row: Manager) => (
        <span className={cn("font-semibold", labelClass(isLight))}>
          {row.name}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row: Manager) => row.email,
      sortable: true,
      cell: (row: Manager) => (
        <span className={cn("font-medium", labelClass(isLight, true))}>
          {row.email}
        </span>
      ),
    },
    {
      name: "Role",
      selector: (row: Manager) => row.role,
      sortable: true,
      cell: (row: Manager) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            row.role === "ADMIN"
              ? "bg-red-500/10 text-red-500"
              : "bg-blue-500/10 text-blue-500"
          )}
        >
          {row.role}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row: Manager) => (
        <div className="w-full flex justify-center">
          <AppButton
            variant="destructive"
            size="icon"
            onClick={() => setManagerToDelete(row)}
            iconOnly
            prefixIcon={Trash2}
            className="h-8 w-8 p-0"
            title="Delete Manager"
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ], [isLight])

  // Handle Form Submission
  const onSubmit = (data: CreateManagerFormValues) => {
    const { confirmPassword, ...payload } = data
    createManager(payload, {
      onSuccess: () => {
        setIsCreateOpen(false)
        reset()
        showNotification("success", "Manager registered successfully!")
      },
      onError: (err: any) => {
        showNotification("error", err?.message || "Failed to register manager.")
      },
    })
  }

  // Handle Delete Confirmation
  const confirmDelete = () => {
    if (!managerToDelete) return
    deleteUser({ targetUserId: managerToDelete.userId }, {
      onSuccess: () => {
        setManagerToDelete(null)
        showNotification("success", "Manager deleted successfully!")
        // If we deleted the last item on the page, move back a page
        if (managersList.length === 1 && page > 1) {
          setPage(page - 1)
        }
      },
      onError: (err: any) => {
        setManagerToDelete(null)
        showNotification("error", err?.message || "Failed to delete manager.")
      },
    })
  }

  return (
    <div className={cn("min-h-full p-4 md:p-6 space-y-6", isLight ? "bg-[#f5f6f8]" : "bg-black")}>
      {/* Floating alert notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <AppAlert variant={notification.variant} message={notification.message} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className={cn("w-6 h-6", labelClass(isLight))} />
          <h1 className={cn("text-2xl font-bold", labelClass(isLight))}>Managers</h1>
        </div>
        <AppButton
          onClick={() => setIsCreateOpen(true)}
          className={cn(
            "rounded-full px-6",
            isLight ? "bg-[#e568f5] hover:bg-[#d04de0] text-white" : "bg-[#FFBF00] hover:bg-[#e6ac00] text-black"
          )}
          prefixIcon={Plus}
        >
          Create Manager
        </AppButton>
      </div>

      {/* Filters Section */}
      <div className={cn("flex flex-wrap items-center gap-3 p-4 rounded-2xl", isLight ? "bg-white" : "bg-white/5")}>
        <div className="relative w-full sm:w-80">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", labelClass(isLight, true))} />
          <input
            type="text"
            placeholder="Search managers by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className={cn(
              "w-full h-10 pl-9 pr-4 rounded-full text-sm outline-none transition-colors border border-transparent",
              isLight
                ? "bg-gray-50 hover:bg-gray-100 placeholder:text-gray-400 focus:border-[#e568f5]/20 focus:bg-white"
                : "bg-black/20 hover:bg-black/40 text-white placeholder:text-white/40 focus:border-[#FFBF00]/20 focus:bg-black"
            )}
          />
        </div>
      </div>

      {/* Main Data Display */}
      {isError ? (
        <div className={cn("text-center py-20 rounded-2xl border", isLight ? "bg-white border-[#0A2463]/10" : "bg-black border-white/10")}>
          <AppAlert variant="error" message={fetchError instanceof Error ? fetchError.message : "Failed to load managers."} className="max-w-md mx-auto" />
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className={cn("animate-spin rounded-full h-8 w-8 border-b-2", isLight ? "border-[#e568f5]" : "border-[#FFBF00]")}></div>
        </div>
      ) : managersList.length === 0 ? (
        <div className={cn("text-center py-20 rounded-2xl border", isLight ? "bg-white border-[#0A2463]/10" : "bg-black border-white/10")}>
          <Users className={cn("w-12 h-12 mx-auto mb-3 opacity-30", labelClass(isLight))} />
          <p className={labelClass(isLight, true)}>No managers found matching your search.</p>
        </div>
      ) : (
        <div className={cardClass(isLight, "overflow-hidden p-0")}>
          <DataTable
            columns={columns}
            data={managersList}
            pagination={false}
          />
          <AppPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Create Manager Modal */}
      <AppModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          reset()
        }}
        title="Create Manager"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                placeholder="Manager's Name"
                disabled={isCreating}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="email"
                label="Email"
                placeholder="manager@evoria.com"
                disabled={isCreating}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                label="Password"
                placeholder="••••••••"
                disabled={isCreating}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                disabled={isCreating}
                error={fieldState.error?.message}
              />
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <AppButton
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false)
                reset()
              }}
              disabled={isCreating}
            >
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              isLoading={isCreating}
              className={cn(
                isLight ? "bg-[#e568f5] hover:bg-[#d04de0] text-white" : "bg-[#FFBF00] hover:bg-[#e6ac00] text-black"
              )}
            >
              Save Manager
            </AppButton>
          </div>
        </form>
      </AppModal>

      {/* Delete Confirmation Modal */}
      <AppConfirmationModal
        open={managerToDelete !== null}
        onClose={() => setManagerToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Manager"
        description={`Are you sure you want to delete ${managerToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}
