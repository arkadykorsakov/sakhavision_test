import {customRef} from "vue";

const focusableElementsSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap() {
    let focusableElements: NodeListOf<HTMLElement> | [] = []
    let $firstFocusable: HTMLElement | null = null
    let $lastFocusable: HTMLElement | null = null
    const trapRef = customRef((track, trigger) => {
        let $trapEl:null|HTMLElement = null
        return {
            get() {
                track()
                return $trapEl
            },
            set(value) {
                $trapEl = value
                value ? initFocusTrap() : clearFocusTrap()
                trigger()
            }
        }
    })

    function keyHandler(e: KeyboardEvent) {
        const isTabPressed = e.key === 'Tab'

        if (!isTabPressed) return

        if (e.shiftKey) {
            if (document.activeElement === $firstFocusable) {
                $lastFocusable?.focus()
                e.preventDefault()
            }
        } else {
            if (document.activeElement === $lastFocusable) {
                $firstFocusable?.focus()
                e.preventDefault()
            }
        }
    }

    function initFocusTrap() {
        if (!trapRef.value) return
        focusableElements = trapRef.value.querySelectorAll(
            focusableElementsSelector
        )
        $firstFocusable = focusableElements[0]
        $lastFocusable = focusableElements[focusableElements.length - 1]
        document.addEventListener('keydown', keyHandler)
        $firstFocusable?.focus()
    }

    function clearFocusTrap() {
        document.removeEventListener('keydown', keyHandler)
    }

    return {
        trapRef,
    }
}

