import { vi, expect, describe, it, afterEach } from 'vitest';
import { useGetSessions } from '../api/use-get-sessions';
import { render } from '@test/utils';
import SessionsList from '../ui/sessions-list';
import { mockSessions } from '@test/mocks/auth';

vi.mock('../api/use-get-sessions');

describe('SessionsList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    vi.mocked(useGetSessions, { partial: true }).mockReturnValue({
      isLoading: true,
    });

    const { getByText } = render(<SessionsList />);

    expect(getByText('Загрузка...')).toBeInTheDocument();
  });

  it('should no sessions state', async () => {
    vi.mocked(useGetSessions, { partial: true }).mockReturnValue({
      data: undefined,
    });

    const { getByText } = render(<SessionsList />);

    expect(getByText('Сеансов нет')).toBeInTheDocument();
  });

  it('should render sessions', async () => {
    vi.mocked(useGetSessions, { partial: true }).mockReturnValue({
      data: {
        current: mockSessions[0],
        other: [mockSessions[1]],
      },
    });

    const { getByText } = render(<SessionsList />);

    expect(getByText('Сеанс')).toBeInTheDocument();
    expect(getByText('Это устройство')).toBeInTheDocument();
    expect(getByText(mockSessions[0].device)).toBeInTheDocument();
  });
});
