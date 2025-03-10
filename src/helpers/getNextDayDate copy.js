function getNextDayDate(targetDay) {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 6 = Sábado
    const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7; // Días hasta el próximo día deseado

    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysUntilTarget);

    // Formateamos la fecha en DD/MM/YY
    const day = String(nextDate.getDate()).padStart(2, '0');
    const month = String(nextDate.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const year = String(nextDate.getFullYear()).slice(-2); // Últimos 2 dígitos del año

    return `${day}/${month}/${year}`;
}

export default getNextDayDate;