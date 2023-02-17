const colorList = ['primary', 'secondary', 'accent', 'dark', 'positive', 'negative', 'info', 'warning']

// 颜色索引
export const colorIndex = (index: number): string => {
    return colorList.length > index ? colorList[index] : colorList[0]
}
