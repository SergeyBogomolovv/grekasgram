import { render } from '@test/utils';
import { vi, describe, it, expect, afterEach } from 'vitest';
import MessageCard from '../ui/message';
import { MessageEntity } from '../model/message.schema';
import userEvent from '@testing-library/user-event';
import { $api } from '@/shared/api';

vi.mock('@/shared/api');
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
    vi.mocked($api.delete).mockResolvedValue({ data: { message: 'ok' } });
    const { getByTestId, getByText } = render(
      <MessageCard message={mockMessage} userId="1" />,
    );

    const user = userEvent.setup();

    await user.pointer({
      keys: '[MouseRight>]',
      target: getByTestId('message-trigger'),
    });

    await user.click(getByText('Удалить'));

    expect($api.delete).toHaveBeenCalledWith('/messages/delete/1');
  });

  it('should edit message', async () => {
    vi.mocked($api.put).mockResolvedValue({ data: { message: 'ok' } });
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

    expect($api.put).toHaveBeenCalledWith('/messages/edit/1', {
      content: 'test new content',
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

    expect($api.put).not.toHaveBeenCalledWith('/messages/edit/1', {
      content: 'test new content',
    });
  });
});
