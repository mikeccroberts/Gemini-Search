import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Eye, EyeOff } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface CustomKeysManagerProps {
    onKeysChange: (keys: string[]) => void;
}

export function CustomKeysManager({ onKeysChange }: CustomKeysManagerProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [keys, setKeys] = useState<string[]>([""]);
    const [showPasswords, setShowPasswords] = useState<boolean[]>([]);

    // Load saved state
    useEffect(() => {
        const savedKeys = localStorage.getItem('customKeys');
        const savedEnabled = localStorage.getItem('customKeysEnabled');

        if (savedKeys) {
            const parsedKeys = JSON.parse(savedKeys);
            setKeys(parsedKeys);
            setShowPasswords(new Array(parsedKeys.length).fill(false));
            if (savedEnabled === 'true') {
                setIsEnabled(true);
                onKeysChange(parsedKeys);
            }
        }
    }, []);

    const handleToggle = (checked: boolean) => {
        setIsEnabled(checked);
        localStorage.setItem('customKeysEnabled', checked.toString());
        if (!checked) {
            // When disabling, clear custom keys
            setKeys([""]);
            setShowPasswords([false]);
            onKeysChange([]);
            localStorage.removeItem('customKeys');
        } else {
            // When enabling, use existing keys
            onKeysChange(keys.filter(Boolean));
        }
    };

    const addKey = () => {
        setKeys([...keys, ""]);
        setShowPasswords([...showPasswords, false]);
    };

    const removeKey = (index: number) => {
        const newKeys = keys.filter((_, i) => i !== index);
        const newShowPasswords = showPasswords.filter((_, i) => i !== index);
        setKeys(newKeys.length ? newKeys : [""]); // Always keep at least one input
        setShowPasswords(newShowPasswords.length ? newShowPasswords : [false]);
        const validKeys = newKeys.filter(Boolean);
        onKeysChange(validKeys);
        localStorage.setItem('customKeys', JSON.stringify(validKeys));
    };

    const updateKey = (index: number, value: string) => {
        const newKeys = [...keys];
        newKeys[index] = value;
        setKeys(newKeys);
        const validKeys = newKeys.filter(Boolean);
        onKeysChange(validKeys);
        localStorage.setItem('customKeys', JSON.stringify(validKeys));
    };

    const togglePasswordVisibility = (index: number) => {
        const newShowPasswords = [...showPasswords];
        newShowPasswords[index] = !newShowPasswords[index];
        setShowPasswords(newShowPasswords);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
                <Switch
                    id="custom-keys"
                    checked={isEnabled}
                    onCheckedChange={handleToggle}
                />
                <Label htmlFor="custom-keys" className="text-sm font-medium">Custom Keys</Label>
            </div>

            {isEnabled && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <Settings2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Custom API Keys</DialogTitle>
                            <DialogDescription>
                                Add your custom Google API keys. These will be used instead of the default keys.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {keys.map((key, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            value={key}
                                            onChange={(e) => updateKey(index, e.target.value)}
                                            placeholder="Enter API key"
                                            type={showPasswords[index] ? "text" : "password"}
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => togglePasswordVisibility(index)}
                                        >
                                            {showPasswords[index] ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeKey(index)}
                                        className="h-10 w-10 flex-shrink-0"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}

                            <Button onClick={addKey} variant="outline" className="w-full">
                                Add Key
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
} 