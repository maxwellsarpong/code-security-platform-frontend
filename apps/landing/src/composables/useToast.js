import { ref } from 'vue'

const toastState = ref({
    show: false,
    message: '',
    variant: 'success'
})

export function useToast() {
    const showToast = (message, variant = 'success') => {
        toastState.value = {
            show: true,
            message,
            variant
        }
    }

    const hideToast = () => {
        toastState.value.show = false
    }

    return {
        toastState,
        showToast,
        hideToast
    }
}
