import Swal, { SweetAlertOptions } from 'sweetalert2';

export const fire = (options: SweetAlertOptions) => Swal.fire(options);

export const info = (title: string, text?: string) => fire({title, icon: 'info', text});

export const success = (title: string, text?: string) => fire({title, icon: 'success', text});

export const warn = (title: string, text?: string) => fire({title, icon: 'warning', text});

export const question = (title: string, text?: string) => fire({title, icon: 'question', text});

export const error = (title: string, text?: string) => fire({title, icon: 'error', text});