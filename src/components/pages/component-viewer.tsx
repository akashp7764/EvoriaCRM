import * as React from "react"
import { TextField } from "@/components/controls/text-field"
import { AppButton } from "@/components/controls/app-button"
import { AppCheckbox } from "@/components/controls/app-checkbox"
import { AppRadioGroup } from "@/components/controls/app-radio-group"
import { AppSelect } from "@/components/controls/app-select"
import { AppMultiSelect } from "@/components/controls/app-multi-select"
import { AppDatePicker } from "@/components/controls/app-date-picker"
import { AppChip } from "@/components/controls/app-chip"
import { AppCard } from "@/components/controls/app-card"
import { AppAlert } from "@/components/controls/app-alert"
import { AppConfirmationModal } from "@/components/controls/app-confirmation-modal"
import { AppBadge } from "@/components/controls/app-badge"
import { Mail, Search, Download, Settings, Check } from "lucide-react"

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12 border-b pb-12 last:border-b-0">
    <h2 className="text-2xl font-bold mb-6 text-brand-ternary">{title}</h2>
    <div className="grid gap-8">{children}</div>
  </section>
)

const Variant = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground mb-3">{label}</p>
    <div className="flex flex-wrap gap-4 items-end">{children}</div>
  </div>
)

export default function ComponentViewer() {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedChips, setSelectedChips] = React.useState<string[]>(["React"])
  const [date, setDate] = React.useState<any>(new Date())

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-brand-primary mb-4">Evoria Component Library</h1>
        <p className="text-muted-foreground text-lg">Detailed showcase of all reusable UI controls built for the platform.</p>
      </header>

      {/* 1. Text Fields */}
      <Section title="1. Text Fields">
        <div className="grid md:grid-cols-2 gap-8">
          <Variant label="Default & Label">
            <TextField label="Full Name" placeholder="John Doe" containerClassName="w-full" />
          </Variant>
          <Variant label="With Icons">
            <TextField 
              label="Email Address" 
              placeholder="john@example.com" 
              prefixIcon={Mail} 
              containerClassName="w-full"
            />
            <TextField 
              label="Search" 
              placeholder="Search events..." 
              suffixIcon={Search} 
              containerClassName="w-full"
            />
          </Variant>
          <Variant label="States (Disabled & Error)">
            <TextField label="Username" placeholder="Locked field" disabled containerClassName="w-full" />
            <TextField 
              label="Password" 
              type="password"
              placeholder="Minimum 8 characters" 
              error="Password must contain at least one special character." 
              containerClassName="w-full"
            />
          </Variant>
        </div>
      </Section>

      {/* 2. Buttons */}
      <Section title="2. Buttons">
        <Variant label="Base Styles">
          <AppButton>Default Button</AppButton>
          <AppButton variant="secondary">Secondary</AppButton>
          <AppButton variant="outline">Outline</AppButton>
          <AppButton variant="ghost">Ghost</AppButton>
          <AppButton variant="destructive">Destructive</AppButton>
          <AppButton variant="link">Link Style</AppButton>
        </Variant>
        <Variant label="With Icons & States">
          <AppButton prefixIcon={Download}>Download Report</AppButton>
          <AppButton suffixIcon={Settings} variant="outline">Settings</AppButton>
          <AppButton iconOnly variant="outline" prefixIcon={Search} />
          <AppButton isLoading>Processing</AppButton>
          <AppButton disabled>Disabled Action</AppButton>
        </Variant>
        <Variant label="Brand Colors">
          <AppButton className="bg-brand-primary hover:bg-brand-primary/90 text-white">Brand Primary</AppButton>
          <AppButton className="bg-brand-ternary hover:bg-brand-ternary/90 text-white">Brand Ternary</AppButton>
        </Variant>
      </Section>

      {/* 3. Checkboxes */}
      <Section title="3. Checkboxes">
        <Variant label="States">
          <AppCheckbox label="I agree to the terms and conditions" />
          <AppCheckbox label="Remember me" defaultChecked />
          <AppCheckbox label="Disabled option" disabled />
          <AppCheckbox label="Newsletter" error="You must accept the newsletter for updates." />
        </Variant>
      </Section>

      {/* 4. Radio Buttons */}
      <Section title="4. Radio Buttons">
        <Variant label="Groups">
          <AppRadioGroup 
            label="Select Ticket Type"
            options={[
              { label: "Standard - $50", value: "standard" },
              { label: "VIP - $150", value: "vip" },
              { label: "Platinum - $300 (Sold out)", value: "plat", disabled: true },
            ]}
            defaultValue="standard"
          />
        </Variant>
      </Section>

      {/* 5. Dropdowns */}
      <Section title="5. Dropdowns">
        <div className="grid md:grid-cols-2 gap-8">
          <Variant label="Standard Select">
            <AppSelect 
              label="Event Category"
              placeholder="Select category"
              options={[
                { label: "Technology", value: "tech" },
                { label: "Music", value: "music" },
                { label: "Business", value: "biz" },
              ]}
              containerClassName="w-full"
            />
          </Variant>
          <Variant label="Searchable Combobox">
            <AppSelect 
              label="Country"
              searchable
              placeholder="Search countries..."
              options={[
                { label: "United States", value: "us" },
                { label: "United Kingdom", value: "uk" },
                { label: "Germany", value: "de" },
                { label: "India", value: "in" },
                { label: "Japan", value: "jp" },
              ]}
              containerClassName="w-full"
            />
          </Variant>
        </div>
      </Section>

      {/* 6. Multi Select */}
      <Section title="6. Multi Select Dropdown">
        <Variant label="Multi Selection with Search">
          <AppMultiSelect 
            label="Tags / Interests"
            placeholder="Select tags"
            options={[
              { label: "React", value: "react" },
              { label: "TypeScript", value: "ts" },
              { label: "Next.js", value: "next" },
              { label: "Tailwind CSS", value: "tw" },
              { label: "Shadcn UI", value: "shad" },
            ]}
            defaultValue={["react", "ts"]}
            className="max-w-md"
          />
        </Variant>
      </Section>

      {/* 7. Date Pickers */}
      <Section title="7. Date Pickers">
        <div className="grid md:grid-cols-2 gap-8">
          <Variant label="Single Date">
            <AppDatePicker 
              label="Event Date"
              value={date}
              onChange={setDate}
            />
          </Variant>
          <Variant label="Date Range">
            <AppDatePicker 
              label="Booking Window"
              mode="range"
            />
          </Variant>
        </div>
      </Section>

      {/* 8. Chips */}
      <Section title="8. Chips (Interactive)">
        <Variant label="Selectable & Closable">
          {["React", "Vue", "Angular", "Svelte"].map(tag => (
            <AppChip 
              key={tag}
              label={tag}
              selected={selectedChips.includes(tag)}
              onClick={() => setSelectedChips(prev => 
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
              )}
              icon={tag === "React" ? Check : undefined}
            />
          ))}
          <AppChip label="Removable" onDelete={() => alert("Deleted!")} />
        </Variant>
      </Section>

      {/* 9. Cards */}
      <Section title="9. Cards (StatCard / EventCard)">
        <div className="grid md:grid-cols-2 gap-8">
          <AppCard 
            title="NextGen Tech AI Summit 2026"
            description="San Francisco, CA • June 15-18"
            image="https://images.unsplash.com/photo-1540575861501-7ad05823c23d?q=80&w=2070&auto=format&fit=crop"
            hoverable
            actions={
              <>
                <AppButton variant="outline" size="sm">Manage</AppButton>
                <AppButton size="sm">Register</AppButton>
              </>
            }
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Capacity: 500</span>
              <AppBadge variant="success">Active</AppBadge>
            </div>
          </AppCard>

          <AppCard title="Quick Stats">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold font-mono">$42.5k</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-bold font-mono">1,204</p>
              </div>
            </div>
          </AppCard>
        </div>
      </Section>

      {/* 10. Alerts */}
      <Section title="10. Alerts">
        <AppAlert 
          variant="success" 
          title="Success!" 
          message="Your event registration has been confirmed. A QR badge has been sent to your email." 
        />
        <AppAlert 
          variant="warning" 
          title="Wait!" 
          message="This event is almost at full capacity. Only 5 tickets remaining." 
        />
        <AppAlert 
          variant="error" 
          title="Error Occurred" 
          message="Unable to process payment. Please verify your billing details and try again." 
        />
        <AppAlert 
          variant="info" 
          message="Admin dashboard will be down for maintenance tonight between 2:00 AM and 4:00 AM UTC." 
        />
      </Section>

      {/* 11. Modal */}
      <Section title="11. Confirmation Modal">
        <AppButton onClick={() => setModalOpen(true)} variant="destructive">
          Open Delete Modal
        </AppButton>
        <AppConfirmationModal 
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={() => {
            alert("Deleted successfully!")
            setModalOpen(false)
          }}
          title="Delete Event?"
          description="Are you sure you want to delete 'NextGen Tech AI Summit'? This action cannot be undone and will cancel all pending registrations."
          confirmText="Yes, Delete"
          variant="destructive"
        />
      </Section>

      {/* 12. Badges */}
      <Section title="12. Badges (Static Status)">
        <Variant label="Variants">
          <AppBadge>Default</AppBadge>
          <AppBadge variant="secondary">Secondary</AppBadge>
          <AppBadge variant="success">Confirmed</AppBadge>
          <AppBadge variant="warning">Pending</AppBadge>
          <AppBadge variant="danger">Rejected</AppBadge>
          <AppBadge variant="outline">Outline</AppBadge>
        </Variant>
      </Section>

      <footer className="mt-20 pt-8 border-t text-center text-muted-foreground text-sm">
        <p>&copy; 2026 Evoria Event Management. All rights reserved.</p>
      </footer>
    </div>
  )
}
