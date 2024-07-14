declare interface Toast {
    id: string;
    type: "success" | "error";
    message: string;
}

export default Toast;