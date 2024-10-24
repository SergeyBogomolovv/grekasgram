import { MessageEntity } from '@/entities/message';
import { $api } from '@/shared/api';
import { render } from '@test/utils';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MessageForm from '../ui/message-form';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

const mockMessage: MessageEntity = {
  id: '1',
  content: 'test',
  createdAt: '2022-01-01T00:00:00.000Z',
  updatedAt: '2022-01-01T00:00:00.000Z',
  chatId: '1',
  fromId: '1',
  imageUrl: null,
  isRead: false,
};

vi.mock('@/shared/api');
vi.mock('sonner');

describe('MessageForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => '/mocked-url');
  });

  it('should send message without image', async () => {
    vi.mocked($api.post).mockResolvedValue({ data: mockMessage });
    const { getByPlaceholderText, getByRole } = render(
      <MessageForm chatId="1" />,
    );

    const user = userEvent.setup();

    await user.type(getByPlaceholderText('Введите сообщение'), 'test');
    await user.click(getByRole('button', { name: 'Отправить сообщение' }));

    expect($api.post).toHaveBeenCalledWith(
      '/messages/create',
      expect.any(FormData),
    );
  });

  it('should send message with image', async () => {
    vi.mocked($api.post).mockResolvedValue({ data: mockMessage });
    const { getByRole, getByTestId } = render(<MessageForm chatId="1" />);

    const user = userEvent.setup();

    const fileInput = getByTestId('image-input');
    const attachButton = getByRole('button', { name: 'Прикрепить файл' });

    const spy = vi.spyOn(fileInput, 'click');

    await user.click(attachButton);
    expect(spy).toHaveBeenCalled();

    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    await user.upload(fileInput, file);

    await user.type(getByTestId('modal-message-input'), 'test');

    await user.click(getByRole('button', { name: 'Отправить сообщение' }));

    expect($api.post).toHaveBeenCalledWith(
      '/messages/create',
      expect.any(FormData),
    );

    const formData = vi.mocked($api.post).mock.calls[0][1] as FormData;
    expect(formData.get('image')).toBe(file);
    expect(formData.get('content')).toBe('test');
  });

  it('should show error when message send fails', async () => {
    vi.mocked($api.post).mockRejectedValue(new Error('Failed to send message'));
    const { getByPlaceholderText, getByRole } = render(
      <MessageForm chatId="1" />,
    );

    const user = userEvent.setup();

    await user.type(getByPlaceholderText('Введите сообщение'), 'test');
    await user.click(getByRole('button', { name: 'Отправить сообщение' }));

    expect(toast.error).toHaveBeenCalledWith(
      'Произошла ошибка при отправке сообщения',
    );
  });

  it('should submit message when pressing Enter without Shift', async () => {
    vi.mocked($api.post).mockResolvedValue({ data: mockMessage });
    const { getByPlaceholderText } = render(<MessageForm chatId="1" />);

    const user = userEvent.setup();
    const input = getByPlaceholderText('Введите сообщение');

    await user.type(input, 'test{enter}');

    expect($api.post).toHaveBeenCalledWith(
      '/messages/create',
      expect.any(FormData),
    );
  });
});
