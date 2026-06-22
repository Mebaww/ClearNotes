export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {[
            { label: "Profile", description: "Name, email, and avatar" },
            { label: "Notifications", description: "Email and in-app alerts" },
            { label: "Billing", description: "Plan, invoices, and payment" },
          ].map((section) => (
            <div
              key={section.label}
              className="flex items-center justify-between rounded-xl border border-border/80 bg-card px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{section.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{section.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">Coming soon</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
