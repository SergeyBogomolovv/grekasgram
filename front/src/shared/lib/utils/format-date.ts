import { format, isToday, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (dateString: string) => {
  if (isToday(dateString)) {
    return format(dateString, 'HH:mm', {
      locale: ru,
    });
  } else if (isYesterday(dateString)) {
    return `Вчера, ${format(dateString, 'HH:mm', { locale: ru })}`;
  } else {
    return format(dateString, 'dd.MM.yyyy, HH:mm', {
      locale: ru,
    });
  }
};
