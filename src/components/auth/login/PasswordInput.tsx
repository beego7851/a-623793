import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  password: string;
  setPassword: (value: string) => void;
  loading: boolean;
}

const PasswordInput = ({ password, setPassword, loading }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-dashboard-text mb-2">
        Password
      </label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pr-10"
          required
          disabled={loading}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-dashboard-muted" />
          ) : (
            <Eye className="h-4 w-4 text-dashboard-muted" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default PasswordInput;