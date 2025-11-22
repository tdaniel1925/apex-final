# 🎨 shadcn/ui Setup Guide

This guide explains how to use shadcn/ui components in the Apex Affinity Group MLM Platform.

---

## 📦 What is shadcn/ui?

**shadcn/ui** is a collection of beautifully designed, accessible components built with:
- ✅ **Radix UI** - Unstyled, accessible component primitives
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **TypeScript** - Full type safety
- ✅ **Copy & Paste** - You own the code (not an npm package!)

---

## 🚀 Installation

shadcn/ui has been added to the project! Here's what's included:

### **Dependencies Added:**
```json
{
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-toast": "^1.1.5",
  "@radix-ui/react-tooltip": "^1.0.7",
  "@radix-ui/react-popover": "^1.0.7",
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-switch": "^1.0.3",
  "@radix-ui/react-separator": "^1.0.3",
  "@radix-ui/react-alert-dialog": "^1.0.5",
  "@radix-ui/react-accordion": "^1.1.2",
  "@radix-ui/react-progress": "^1.0.3",
  "lucide-react": "^0.index.3",
  "class-variance-authority": "^0.7.0",
  "cmdk": "^1.0.0"
}
```

---

## 📁 Project Structure

```
apex-final/
├── components/
│   ├── ui/                    # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   └── ...                    # Your custom components
├── lib/
│   └── utils.ts              # Utility functions (cn, formatCurrency, etc.)
├── components.json           # shadcn/ui configuration
└── ...
```

---

## 🎯 Adding Components

To add a shadcn/ui component, use the CLI:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
```

### **Or add multiple at once:**
```bash
npx shadcn-ui@latest add button card dialog form input label select table toast
```

---

## 🧩 Recommended Components for MLM Platform

### **Phase 1: Essential Components**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add separator
```

### **Phase 2-3: Forms & Navigation**
```bash
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
```

### **Phase 3-5: Data Display**
```bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add alert-dialog
```

### **Phase 5-7: Advanced Components**
```bash
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add command
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add scroll-area
```

---

## 💡 Usage Examples

### **1. Button Component**

```tsx
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <div className="space-x-2">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
```

### **2. Card Component**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DashboardCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Earnings</CardTitle>
        <CardDescription>Your commission this month</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">$12,450.00</p>
      </CardContent>
      <CardFooter>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  )
}
```

### **3. Form with Validation**

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
```

### **4. Dialog Modal**

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ApprovalDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Approve Photo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Profile Photo?</DialogTitle>
          <DialogDescription>
            This will make the photo visible on the distributor's replicated site.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Approve</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### **5. Data Table**

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const distributors = [
  { id: 1, name: "John Doe", rank: "Diamond", sales: "$12,450" },
  { id: 2, name: "Jane Smith", rank: "Executive", sales: "$8,230" },
]

export function DistributorsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Rank</TableHead>
          <TableHead>Sales</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {distributors.map((dist) => (
          <TableRow key={dist.id}>
            <TableCell>{dist.name}</TableCell>
            <TableCell>{dist.rank}</TableCell>
            <TableCell>{dist.sales}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### **6. Toast Notifications**

```tsx
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

export function CommissionNotification() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Commission Earned!",
          description: "You earned $125.00 from a new team member.",
        })
      }}
    >
      Show Toast
    </Button>
  )
}
```

---

## 🎨 Theming & Customization

### **Colors**

Edit `app/globals.css` to customize colors:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    /* ... more colors */
  }
}
```

### **Dark Mode**

shadcn/ui supports dark mode out of the box! Toggle with:

```tsx
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </Button>
  )
}
```

---

## 🔧 Utility Functions

The `lib/utils.ts` file includes helpful utilities:

```tsx
import { cn, formatCurrency, formatNumber, truncate, getInitials } from "@/lib/utils"

// Merge classes
<div className={cn("bg-primary text-white", isActive && "font-bold")} />

// Format currency
{formatCurrency(12450)} // "$12,450.00"

// Format numbers
{formatNumber(500)} // "500"

// Truncate text
{truncate("Long text here...", 20)} // "Long text here..."

// Get initials
{getInitials("John Doe")} // "JD"
```

---

## 📚 Component Library for MLM Platform

### **Dashboard Components**
- ✅ Card - Metrics display
- ✅ Table - Data tables
- ✅ Progress - Rank advancement
- ✅ Badge - Status indicators
- ✅ Avatar - User profiles

### **Form Components**
- ✅ Input - Text fields
- ✅ Select - Dropdowns
- ✅ Checkbox - Multi-select
- ✅ Switch - Toggles
- ✅ Form - Validation wrapper

### **Navigation Components**
- ✅ Tabs - Multi-section views
- ✅ Dropdown Menu - User actions
- ✅ Command - Search palette

### **Feedback Components**
- ✅ Toast - Notifications
- ✅ Alert - Important messages
- ✅ Dialog - Modals
- ✅ Alert Dialog - Confirmations

---

## 🚀 Next Steps

1. **Install components as needed:**
   ```bash
   npx shadcn-ui@latest add button card form
   ```

2. **Customize theme colors** in `app/globals.css`

3. **Build custom components** in `components/` folder

4. **Use in pages** throughout the app

---

## 📖 Resources

- **Official Docs:** https://ui.shadcn.com
- **Component Examples:** https://ui.shadcn.com/examples
- **Radix UI Docs:** https://radix-ui.com
- **Tailwind CSS:** https://tailwindcss.com

---

**Document Version:** 1.0
**Last Updated:** [Auto-generated]
