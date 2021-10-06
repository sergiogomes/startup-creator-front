import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (mensagem) => toast.success(mensagem);
export const notifyError = (mensagem) => toast.error(mensagem);
export const notifyWarning = (mensagem) => toast.warning(mensagem);
export const notifyInfos = (mensagem) => toast.info(mensagem);
