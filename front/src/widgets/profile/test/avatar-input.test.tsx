import { fireEvent, screen } from '@testing-library/react';
import { renderComponentWithQueryClient } from '@test/render-component-with-query';
import AvatarInput from '../ui/avatar-input';
import { UseFormReturn } from 'react-hook-form';
import { vi } from 'vitest';

const mockForm: UseFormReturn<any> = {
  setValue: vi.fn(),
} as any;

describe('AvatarInput', () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'mocked-url');
  });
  it('should render fallback (SVG) when no avatarUrl is provided', () => {
    renderComponentWithQueryClient(
      <AvatarInput form={mockForm} avatarUrl={null} />,
    );

    const fallbackIcon = screen.getByLabelText('Аватар пользователя');
    expect(fallbackIcon).toBeInTheDocument();
    expect(fallbackIcon.tagName).toBe('svg');
  });

  it('should open file input when button is clicked', () => {
    renderComponentWithQueryClient(
      <AvatarInput form={mockForm} avatarUrl="initial-avatar-url" />,
    );

    const button = screen.getByTestId('avatar-input-button');
    const fileInput = screen.getByTestId('avatar-input');

    const clickSpy = vi.spyOn(fileInput, 'click');

    fireEvent.click(button);
    expect(clickSpy).toHaveBeenCalled();
  });
});
