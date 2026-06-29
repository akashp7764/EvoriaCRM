import DataTableComponent, { TableProps } from "react-data-table-component"
import { useTheme } from "@/layouts/dashboard-layout"

export interface DataTableProps<T> extends TableProps<T> {
  // Add any custom props if needed
}

export function DataTable<T>({ ...props }: DataTableProps<T>) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  // Custom styles to integrate seamlessly with standard Evoria Tailwind look (both light and dark modes)
  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    header: {
      style: {
        minHeight: "56px",
        fontSize: "18px",
        fontWeight: "bold",
        backgroundColor: "transparent",
        color: isLight ? "#0A2463" : "#ffffff",
      },
    },
    headRow: {
      style: {
        backgroundColor: isLight ? "rgba(249, 250, 251, 0.5)" : "rgba(255, 255, 255, 0.02)",
        borderBottomWidth: "1px",
        borderBottomColor: isLight ? "rgba(10, 36, 99, 0.05)" : "rgba(255, 255, 255, 0.08)",
      },
    },
    headCells: {
      style: {
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
        color: isLight ? "rgba(10, 36, 99, 0.5)" : "rgba(255, 255, 255, 0.4)",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "56px",
        backgroundColor: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.01)",
        borderBottomWidth: "1px",
        borderBottomColor: isLight ? "rgba(10, 36, 99, 0.05)" : "rgba(255, 255, 255, 0.08)",
        transitionProperty: "background-color",
        transitionDuration: "150ms",
        "&:hover": {
          backgroundColor: isLight ? "rgba(243, 244, 246, 0.5)" : "rgba(255, 255, 255, 0.03)",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        color: isLight ? "#0A2463" : "#ffffff",
      },
    },
    pagination: {
      style: {
        borderTopWidth: "1px",
        borderTopColor: isLight ? "rgba(10, 36, 99, 0.05)" : "rgba(255, 255, 255, 0.08)",
        color: isLight ? "#0A2463" : "#ffffff",
        backgroundColor: isLight ? "#ffffff" : "transparent",
      },
      pageButtonsStyle: {
        fill: isLight ? "#0A2463" : "#ffffff",
        "&:disabled": {
          fill: isLight ? "rgba(10, 36, 99, 0.3)" : "rgba(255, 255, 255, 0.3)",
        },
      },
    },
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-inherit">
      <DataTableComponent
        theme={isLight ? "light" : "dark"}
        customStyles={customStyles}
        responsive
        {...props}
      />
    </div>
  )
}
