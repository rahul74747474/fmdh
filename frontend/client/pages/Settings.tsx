// src/pages/Settings.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSettings, useSaveSettings } from "@/lib/hooks";
import { Briefcase, CreditCard, MessageSquare } from "lucide-react";

export default function Settings() {
  const { data: settingsData, isLoading } = useSettings();
  const saveSettings = useSaveSettings();

  const [settings, setSettings] = useState({
    teamName: "", teamEmail: "", teamPhone: "", upiId: "", whatsappToken: "", whatsappPhoneId: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settingsData) setSettings(settingsData);
  }, [settingsData]);

  const handleInputChange = (field: string, value: string) => setSettings({ ...settings, [field]: value });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await saveSettings.mutateAsync(settings);
      toast.success("Settings saved successfully!");
    } catch (e) {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-full p-8 space-y-8">
      <div className="space-y-6">
        <Card className="border-gold-glow">
          <CardHeader className="flex items-center gap-3"><Briefcase className="w-6 h-6 text-primary"/><CardTitle className="text-white">Team Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-foreground">Team Name</Label><Input value={settings.teamName || ""} onChange={(e) => handleInputChange("teamName", e.target.value)} className="mt-1"/></div>
              <div><Label className="text-foreground">Team Email</Label><Input type="email" value={settings.teamEmail || ""} onChange={(e) => handleInputChange("teamEmail", e.target.value)} className="mt-1"/></div>
              <div className="md:col-span-2"><Label className="text-foreground">Team Phone</Label><Input value={settings.teamPhone || ""} onChange={(e) => handleInputChange("teamPhone", e.target.value)} className="mt-1"/></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold-glow">
          <CardHeader className="flex items-center gap-3"><CreditCard className="w-6 h-6 text-primary"/><CardTitle className="text-white">Finance Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label className="text-foreground">UPI ID</Label><div className="mt-1 flex gap-2"><Input value={settings.upiId || ""} onChange={(e) => handleInputChange("upiId", e.target.value)} placeholder="yourname@upi"/></div><p className="text-xs text-muted-foreground mt-2">Enter your UPI ID for collecting payments</p></div>
          </CardContent>
        </Card>

        <Card className="border-gold-glow">
          <CardHeader className="flex items-center gap-3"><MessageSquare className="w-6 h-6 text-primary"/><CardTitle className="text-white">WhatsApp API Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-foreground">API Token</Label><Input type="password" value={settings.whatsappToken || ""} onChange={(e) => handleInputChange("whatsappToken", e.target.value)} placeholder="Enter your WhatsApp API token" className="mt-1"/></div>
              <div><Label className="text-foreground">Phone Number ID</Label><Input value={settings.whatsappPhoneId || ""} onChange={(e) => handleInputChange("whatsappPhoneId", e.target.value)} placeholder="Enter your phone number ID" className="mt-1"/></div>
            </div>
            <p className="text-xs text-muted-foreground">Configure WhatsApp integration for automated player notifications</p>
          </CardContent>
        </Card>

        <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full md:w-auto h-11 text-base border-gold-glow">{isSaving ? "Saving..." : "Save Settings"}</Button>
      </div>
    </div>
  );
}
