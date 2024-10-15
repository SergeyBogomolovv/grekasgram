import { describe, vi, expect, it } from 'vitest';
import ChatOptions from '../ui/chat-options';
import { Button } from '@/shared/ui/button';
import { render } from '@test/utils';
import userEvent from '@testing-library/user-event';
import { $api } from '@/shared/api';
import { toast } from 'sonner';
import { useRemoveFromFavorites } from '../api/use-remove-from-favorites';
import { useDeleteChat } from '../api/use-delete-chat';

vi.mock('../api/use-get-favorites', () => ({
  useGetFavorites: () => ({
    data: [{ id: '2' }, { id: '3' }],
  }),
}));

vi.mock('@/shared/api', () => ({
  $api: {
    post: vi.fn().mockResolvedValue({ data: { message: 'ok' } }),
  },
}));

vi.mock('../api/use-remove-from-favorites');
vi.mock('../api/use-delete-chat');

describe('ChatOptions', () => {
  it('should call add to favorites', async () => {
    vi.mocked(useRemoveFromFavorites, { partial: true }).mockReturnValue({
      mutate: vi.fn(),
    });
    vi.mocked(useDeleteChat, { partial: true }).mockReturnValue({
      mutate: vi.fn(),
    });
    vi.spyOn(toast, 'success');

    const { getByTestId, getByText } = render(
      <ChatOptions chatId="1" name="test">
        <Button data-testid="button">test</Button>
      </ChatOptions>,
    );

    const user = userEvent.setup();

    await user.click(getByTestId('button'));

    await user.click(getByText('Добавить в избранное'));

    expect($api.post).toHaveBeenCalledWith('/chats/add-to-favorites/1');

    expect(toast.success).toHaveBeenCalledWith('Чат добавлен в избранное');
  });

  it('should call remove from favorites', async () => {
    const mockMutate = vi.fn();
    vi.mocked(useRemoveFromFavorites, { partial: true }).mockReturnValue({
      mutate: mockMutate,
    });

    vi.spyOn(toast, 'success');

    const { getByTestId, getByText } = render(
      <ChatOptions chatId="2" name="test">
        <Button data-testid="button">test</Button>
      </ChatOptions>,
    );

    const user = userEvent.setup();

    await user.click(getByTestId('button'));

    await user.click(getByText('Удалить из избранного'));

    expect(mockMutate).toHaveBeenCalledWith('2');
  });

  it('should call delete chat', async () => {
    const mockMutate = vi.fn();
    vi.mocked(useDeleteChat, { partial: true }).mockReturnValue({
      mutate: mockMutate,
    });

    vi.spyOn(toast, 'success');

    const { getByTestId, getByText } = render(
      <ChatOptions chatId="3" name="test">
        <Button data-testid="button">test</Button>
      </ChatOptions>,
    );

    const user = userEvent.setup();

    await user.click(getByTestId('button'));

    await user.click(getByText('Удалить'));

    await user.click(getByText('Подтвердить'));

    expect(mockMutate).toHaveBeenCalledWith('3');
  });
  it('should not call delete chat', async () => {
    const mockMutate = vi.fn();
    vi.mocked(useDeleteChat, { partial: true }).mockReturnValue({
      mutate: mockMutate,
    });

    vi.spyOn(toast, 'success');

    const { getByTestId, getByText } = render(
      <ChatOptions chatId="3" name="test">
        <Button data-testid="button">test</Button>
      </ChatOptions>,
    );

    const user = userEvent.setup();

    await user.click(getByTestId('button'));

    await user.click(getByText('Удалить'));

    await user.click(getByText('Отмена'));

    expect(mockMutate).not.toHaveBeenCalledWith('3');
  });
});
