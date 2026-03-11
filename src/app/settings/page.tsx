"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Sparkles,
  Info,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  // Profile (cosmetic)
  const [name, setName] = useState("Dr. Sarah Mitchell");
  const [email, setEmail] = useState("sarah.mitchell@physioai.com");
  const [phone, setPhone] = useState("(02) 9555 1234");
  const [clinic, setClinic] = useState("PhysioAI Clinic Sydney");

  // Notifications (cosmetic)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [referralAlerts, setReferralAlerts] = useState(true);
  const [patientMessages, setPatientMessages] = useState(true);

  // AI Settings (cosmetic)
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoParseReferrals, setAutoParseReferrals] = useState(true);
  const [aiModel, setAiModel] = useState("gemini-pro");

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
          <Settings className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Profile</h2>
          </div>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </span>
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic" className="text-xs">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Clinic
                </span>
              </Label>
              <Input
                id="clinic"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="sm">Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Notifications</h2>
          </div>
          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive email updates for important events
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">SMS Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Get text messages for urgent alerts
                </p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Appointment Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Notify before upcoming appointments
                </p>
              </div>
              <Switch
                checked={appointmentReminders}
                onCheckedChange={setAppointmentReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Referral Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Alert when new referrals arrive
                </p>
              </div>
              <Switch
                checked={referralAlerts}
                onCheckedChange={setReferralAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Patient Messages</p>
                <p className="text-xs text-muted-foreground">
                  Notify for new patient messages
                </p>
              </div>
              <Switch
                checked={patientMessages}
                onCheckedChange={setPatientMessages}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">AI Settings</h2>
          </div>
          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Suggestions</p>
                <p className="text-xs text-muted-foreground">
                  Show AI-powered suggestions for treatment plans and exercises
                </p>
              </div>
              <Switch
                checked={aiSuggestions}
                onCheckedChange={setAiSuggestions}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-parse Referrals</p>
                <p className="text-xs text-muted-foreground">
                  Automatically parse referral letters when received
                </p>
              </div>
              <Switch
                checked={autoParseReferrals}
                onCheckedChange={setAutoParseReferrals}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">AI Model</Label>
              <Select value={aiModel} onValueChange={(v) => setAiModel(v ?? "gemini-pro")}>
                <SelectTrigger className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
                  <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                Select which AI model to use for suggestions and chat
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">About</h2>
          </div>
          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Application</span>
              <span className="font-medium">PhysioAI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-medium">Next.js 16</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Engine</span>
              <span className="font-medium">Google Gemini</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
