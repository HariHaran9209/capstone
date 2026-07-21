import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, FileText, Bell, CheckCircle2, Loader2 } from 'lucide-react';

export const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  bio: z
    .string()
    .max(150, 'Bio must not exceed 150 characters')
    .optional()
    .or(z.literal('')),
  notifications: z.boolean().default(false),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  onSuccess?: (data: SettingsFormData) => void;
  initialValues?: Partial<SettingsFormData>;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  onSuccess,
  initialValues,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    mode: 'onBlur',
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      bio: initialValues?.bio || '',
      notifications: initialValues?.notifications || false,
    },
  });

  const bioValue = watch('bio') || '';

  const onSubmit = async (data: SettingsFormData) => {
    setSuccessMessage(null);
    // Mock API call with 1s delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccessMessage('Profile updated successfully!');
    if (onSuccess) {
      onSuccess(data);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" />
          Profile Settings
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Update your personal details and communication preferences.
        </p>
      </div>

      {successMessage && (
        <div
          role="alert"
          className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center gap-3 animate-fadeIn"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-200"
          >
            Name <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/60 text-slate-100 text-sm rounded-xl border transition-all duration-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-500/80 focus:ring-rose-500/40 focus:border-rose-500'
                  : 'border-slate-700/80 focus:ring-indigo-500/40 focus:border-indigo-500'
              }`}
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p
              id="name-error"
              className="text-xs text-rose-400 font-medium mt-1 animate-fadeIn"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-200"
          >
            Email Address <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-800/60 text-slate-100 text-sm rounded-xl border transition-all duration-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-500/80 focus:ring-rose-500/40 focus:border-rose-500'
                  : 'border-slate-700/80 focus:ring-indigo-500/40 focus:border-indigo-500'
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p
              id="email-error"
              className="text-xs text-rose-400 font-medium mt-1 animate-fadeIn"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-slate-200"
            >
              Bio <span className="text-xs text-slate-400 font-normal">(Optional)</span>
            </label>
            <span
              className={`text-xs ${
                bioValue.length > 150
                  ? 'text-rose-400 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {bioValue.length}/150
            </span>
          </div>
          <div className="relative">
            <textarea
              id="bio"
              rows={4}
              maxLength={150}
              placeholder="Tell us a little bit about yourself..."
              aria-invalid={!!errors.bio}
              aria-describedby={errors.bio ? 'bio-error' : undefined}
              className={`w-full p-3.5 bg-slate-800/60 text-slate-100 text-sm rounded-xl border transition-all duration-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 resize-none ${
                errors.bio
                  ? 'border-rose-500/80 focus:ring-rose-500/40 focus:border-rose-500'
                  : 'border-slate-700/80 focus:ring-indigo-500/40 focus:border-indigo-500'
              }`}
              {...register('bio')}
            />
          </div>
          {errors.bio && (
            <p
              id="bio-error"
              className="text-xs text-rose-400 font-medium mt-1 animate-fadeIn"
            >
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Notifications Toggle */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <label
                  htmlFor="notifications"
                  className="text-sm font-medium text-slate-200 cursor-pointer"
                >
                  Email Notifications
                </label>
                <p className="text-xs text-slate-400">
                  Receive email updates about your account activity.
                </p>
              </div>
            </div>
            <label
              htmlFor="notifications"
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                id="notifications"
                type="checkbox"
                className="sr-only peer"
                {...register('notifications')}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
