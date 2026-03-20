export function getStatusColor(status: string): string {
  switch (status) {
    case 'published':
      return 'bg-[#5ADC5A]/10 text-[#3a8a3a] dark:text-[#69b969] hover:bg-[#5ADC5A]/20';
    case 'draft':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20';
    case 'scheduled':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20';
    case 'archived':
      return 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-500/20';
    default:
      return '';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'published':
      return 'Опубликована';
    case 'draft':
      return 'Черновик';
    case 'scheduled':
      return 'Запланирована';
    case 'archived':
      return 'В архиве';
    default:
      return status;
  }
}
