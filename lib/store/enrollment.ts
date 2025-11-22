import { create } from 'zustand'

export type EnrollmentData = {
  // Step 1: Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string

  // Step 2: Address
  address: string
  city: string
  state: string
  zipCode: string
  country: string

  // Step 3: Account Setup
  username: string
  password: string
  confirmPassword: string

  // Step 4: Sponsor Information
  sponsorUsername: string
  sponsorId: string | null
  sponsorName: string

  // Step 5: Autoship Selection
  autoshipProductIds: number[]
  autoshipTotal: number

  // Step 6: Payment & Tax
  taxFormUploaded: boolean
  taxFormUrl: string
  paymentMethodId: string
  agreedToTerms: boolean
}

type EnrollmentStore = {
  currentStep: number
  data: EnrollmentData
  setCurrentStep: (step: number) => void
  updateData: (partialData: Partial<EnrollmentData>) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  canProceed: (step: number) => boolean
}

const initialData: EnrollmentData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  username: '',
  password: '',
  confirmPassword: '',
  sponsorUsername: '',
  sponsorId: null,
  sponsorName: '',
  autoshipProductIds: [],
  autoshipTotal: 0,
  taxFormUploaded: false,
  taxFormUrl: '',
  paymentMethodId: '',
  agreedToTerms: false,
}

export const useEnrollment = create<EnrollmentStore>((set, get) => ({
  currentStep: 1,
  data: initialData,

  setCurrentStep: (step) => set({ currentStep: step }),

  updateData: (partialData) =>
    set((state) => ({
      data: { ...state.data, ...partialData },
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 6),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  reset: () =>
    set({
      currentStep: 1,
      data: initialData,
    }),

  canProceed: (step) => {
    const { data } = get()

    switch (step) {
      case 1:
        return !!(
          data.firstName &&
          data.lastName &&
          data.email &&
          data.phone &&
          data.dateOfBirth
        )
      case 2:
        return !!(
          data.address &&
          data.city &&
          data.state &&
          data.zipCode &&
          data.country
        )
      case 3:
        return !!(
          data.username &&
          data.password &&
          data.confirmPassword &&
          data.password === data.confirmPassword &&
          data.password.length >= 8
        )
      case 4:
        return !!(data.sponsorId && data.sponsorName)
      case 5:
        return data.autoshipProductIds.length > 0 && data.autoshipTotal >= 100
      case 6:
        return !!(
          data.taxFormUploaded &&
          data.paymentMethodId &&
          data.agreedToTerms
        )
      default:
        return false
    }
  },
}))
