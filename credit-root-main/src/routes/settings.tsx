import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppStore, type ThemeMode } from "@/store/useAppStore";
import { useState } from "react";
import { Sun, Moon, Monitor, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import type { SignalKey } from "@/lib/score";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CreditRoot" },
      { name: "description", content: "Manage your profile, data sources, notifications and theme." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const sources = useAppStore((s) => s.sources);
  const setSource = useAppStore((s) => s.setSource);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const reset = useAppStore((s) => s.reset);

  const [editing, setEditing] = useState(false);
  const [notif, setNotif] = useState({ score: true, offers: true, weekly: false, tips: true, payment: true });

  const initials = (profile.name || "U").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <AppShell>
      <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
      <p className="text-sm text-muted-foreground">Manage your profile, preferences and data.</p>

      {/* Profile */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Profile</h3>
            <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>
              {editing ? "Done" : "Edit"}
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-brand text-primary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ name: e.target.value })}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ phone: e.target.value })}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={profile.email ?? ""}
                  onChange={(e) => setProfile({ email: e.target.value })}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={profile.city ?? ""}
                  onChange={(e) => setProfile({ city: e.target.value })}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data sources */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Data sources</h3>
          <ul className="mt-4 space-y-2">
            {(["utility", "mobile", "rent", "upi", "employment"] as SignalKey[]).map((k) => (
              <li key={k} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium capitalize">{k}</div>
                  <div className="text-xs text-muted-foreground">
                    {sources[k] ? "Last synced just now" : "Not connected"}
                  </div>
                </div>
                <Switch checked={sources[k]} onCheckedChange={(v) => setSource(k, v)} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <ul className="mt-4 space-y-2">
            {([
              ["score", "Score change alerts"],
              ["offers", "New loan offer notifications"],
              ["weekly", "Weekly behavior summary email"],
              ["tips", "Tips and reminders"],
              ["payment", "Payment reminders"],
            ] as const).map(([k, label]) => (
              <li key={k} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{label}</span>
                <Switch
                  checked={notif[k]}
                  onCheckedChange={(v) => setNotif((n) => ({ ...n, [k]: v }))}
                />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Label>Payment reminder advance</Label>
            <Select defaultValue="3">
              <SelectTrigger className="mt-1 max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 3, 7].map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d} day{d > 1 ? "s" : ""} before
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {([
              ["light", "Light", Sun],
              ["dark", "Dark", Moon],
              ["system", "System", Monitor],
            ] as [ThemeMode, string, typeof Sun][]).map(([t, label, Icon]) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition ${
                  theme === t ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Privacy & data</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Data download started (demo)")}
            >
              <Download className="mr-1.5 h-4 w-4" /> Download my data
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="mr-1.5 h-4 w-4" /> Reset account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset your CreditRoot data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear your profile, connected sources and score. You can re-onboard at any time.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      reset();
                      toast.success("Your account has been reset");
                    }}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
