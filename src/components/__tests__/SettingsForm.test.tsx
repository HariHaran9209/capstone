import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { SettingsForm } from '../SettingsForm';

describe('SettingsForm Component', () => {
  it('renders all form fields, labels, and the submit button', () => {
    render(<SettingsForm />);

    // Labels and Inputs
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email notifications/i)).toBeInTheDocument();

    // Character Counter
    expect(screen.getByText('0/150')).toBeInTheDocument();

    // Submit Button
    expect(
      screen.getByRole('button', { name: /save settings/i })
    ).toBeInTheDocument();
  });

  it('displays email error message when an invalid email is entered and blurred', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const emailInput = screen.getByLabelText(/email address/i);

    // Type invalid email and blur field
    await user.type(emailInput, 'invalid-email-format');
    await user.tab(); // Blur field to trigger validation

    // Assert inline validation error message appears
    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();
    });

    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles successful form submission and displays success toast', async () => {
    const user = userEvent.setup();
    const handleSuccess = vi.fn();

    render(<SettingsForm onSuccess={handleSuccess} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const bioInput = screen.getByLabelText(/bio/i);
    const submitButton = screen.getByRole('button', { name: /save settings/i });

    // Fill valid data
    await user.type(nameInput, 'Alex Morgan');
    await user.type(emailInput, 'alex@example.com');
    await user.type(bioInput, 'Fullstack web developer.');
    await user.tab();

    // Submit button should now be enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // Click submit
    await user.click(submitButton);

    // Verify loading state
    expect(screen.getByText(/saving changes/i)).toBeInTheDocument();

    // Wait for mock API completion (1s delay)
    await waitFor(
      () => {
        expect(
          screen.getByText('Profile updated successfully!')
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(handleSuccess).toHaveBeenCalledWith({
      name: 'Alex Morgan',
      email: 'alex@example.com',
      bio: 'Fullstack web developer.',
      notifications: false,
    });
  });
});
