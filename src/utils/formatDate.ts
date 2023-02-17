import {date} from 'quasar'
import {useI18n} from 'vue-i18n';

// 格式化时间戳
export const formatDate = (timestamp: number, format: string): string => {
    return date.formatDate(timestamp * 1000, format)
}

// 时间戳过去时间
export const agoFormatDate = (timestamp: number): string => {
    const $i18n = useI18n()
    timestamp = timestamp * 1000
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const nowTime = new Date().getTime();
    const diffValue = nowTime - timestamp
    if (diffValue < 0) {
        return $i18n.t('whileAgo');
    }

    const monthDifference = diffValue / month;
    const weekDifference = diffValue / (7 * day);
    const dayDifference = diffValue / day;
    const hourDifference = diffValue / hour;
    const minDifference = diffValue / minute;

    if (monthDifference > 4) {
        return formatDate(timestamp, 'YYYY/MM/DD HH:ii:ss')
    } else if (monthDifference >= 1) {
        return parseInt(String(monthDifference)) + ' ' + $i18n.t('monthsAgo');
    } else if (weekDifference >= 1) {
        return parseInt(String(weekDifference)) + ' ' + $i18n.t('weeksAgo');
    } else if (dayDifference >= 1) {
        return parseInt(String(dayDifference)) + ' ' + $i18n.t('daysAgo');
    } else if (hourDifference >= 1) {
        return parseInt(String(hourDifference)) + ' ' + $i18n.t('hoursAgo');
    } else if (minDifference >= 1) {
        return parseInt(String(minDifference)) + ' ' + $i18n.t('minutesAgo');
    }
    return $i18n.t('justNow')
}
