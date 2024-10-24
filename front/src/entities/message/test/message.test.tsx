import { render } from '@test/utils';
import { vi, describe, it, expect, afterEach } from 'vitest';
import MessageCard from '../ui/message';
import { MessageEntity } from '../model/message.schema';
import userEvent from '@testing-library/user-event';
import { socket } from '@/shared/api';

vi.spyOn(socket, 'emit');
vi.stubGlobal(
  'IntersectionObserver',
  vi.fn(() => ({ observe: vi.fn(), unobserve: vi.fn() })),
);

const mockMessage: MessageEntity = {
  id: '1',
  content: 'test',
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
  fromId: '1',
  chatId: '1',
  imageUrl: null,
  isRead: false,
};

describe('MessageCard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should render', () => {
    const { getByTestId, getByText } = render(
      <MessageCard message={mockMessage} userId="1" />,
    );

    expect(getByTestId('message-trigger')).toBeInTheDocument();
    expect(getByText('test')).toBeInTheDocument();
  });

  it('should be disabled if fromId is not equal to userId', () => {
    const { getByTestId } = render(
      <MessageCard message={mockMessage} userId="2" />,
    );

    expect(getByTestId('message-trigger')).toHaveAttribute('data-disabled');
  });

  it('should call delete message', async () => {
    const { getByTestId, getByText } = render(
      <MessageCard message={mockMessage} userId="1" />,
    );

    const user = userEvent.setup();

    await user.pointer({
      keys: '[MouseRight>]',
      target: getByTestId('message-trigger'),
    });

    await user.click(getByText('Удалить'));

    expect(socket.emit).toHaveBeenCalledWith('delete_message', mockMessage.id);
  });

  it('should edit message', async () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <MessageCard message={mockMessage} userId="1" />,
    );

    const user = userEvent.setup();

    await user.pointer({
      keys: '[MouseRight>]',
      target: getByTestId('message-trigger'),
    });

    await user.click(getByText('Редактировать'));

    await user.type(getByPlaceholderText('Введите сообщение'), ' new content');

    await user.click(getByText('Сохранить'));

    expect(socket.emit).toHaveBeenCalledWith('edit_message', {
      content: 'test new content',
      messageId: mockMessage.id,
    });
  });

  it('should cancel edit message', async () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <MessageCard message={mockMessage} userId="1" />,
    );

    const user = userEvent.setup();

    await user.pointer({
      keys: '[MouseRight>]',
      target: getByTestId('message-trigger'),
    });

    await user.click(getByText('Редактировать'));

    await user.type(getByPlaceholderText('Введите сообщение'), ' new content');

    await user.click(getByText('Отмена'));

    expect(socket.emit).not.toHaveBeenCalled();
  });
});
