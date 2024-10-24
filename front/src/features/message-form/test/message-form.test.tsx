import { socket } from '@/shared/api';
import { render } from '@test/utils';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MessageForm from '../ui/message-form';
import userEvent from '@testing-library/user-event';

vi.spyOn(socket, 'emit');

describe('MessageForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => '/mocked-url');
  });

  it('should send message without image', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <MessageForm chatId="1" />,
    );

    const user = userEvent.setup();

    await user.type(getByPlaceholderText('Введите сообщение'), 'test');
    await user.click(getByRole('button', { name: 'Отправить сообщение' }));

    expect(socket.emit).toHaveBeenCalledWith('send_message', {
      content: 'test',
      chatId: '1',
    });
  });

  it('should send message with image', async () => {
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

    expect(socket.emit).toHaveBeenCalledWith('send_message', {
      content: 'test',
      chatId: '1',
      image: file,
    });
  });
});
