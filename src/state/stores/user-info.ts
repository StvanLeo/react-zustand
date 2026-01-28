import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

const initialState = {
    userInfo: {
        name: 'John Doe',
        email: 'john@doe.com',
        age: 30,
        searches: {
            preferences: {
                lastSearch: '',
            }
        }
    },
    addresses: {
        billing: {
            street: '123 Main St.',
            city: 'Anytown',
            state: 'CA',
            zip: '12345'
        },
        shipping: {
            street: '456 Main St.',
            city: 'Sometown',
            state: 'CA',
            zip: '67890',
            preferences: {
                leaveAtDoor: true,
                deliveryInstructions: 'Ring the doorbell',
            }
        }
    }
}

const useUserInfoStore = create(immer(persist(devtools((set) => ({
   ...initialState,
    updateDeliveryInstructions: (instructions: string) => {
        /* 
        WIHTOUT IMMER

        set((state) => ({
            addresses: {
                ...state.addresses,
                shipping: {
                    ...state.addresses.shipping,
                    preferences: {
                        ...state.addresses.shipping.preferences,
                        deliveryInstructions: instructions,
                    }
                }
            }
        })) */

        // WITH IMMER
        set((state) => {
            state.addresses.shipping.preferences.deliveryInstructions = instructions;
        }, false, {type: 'updateDeliveryInstructions'});
   },
   updateLastSearch: (searchStr: string) => {
        set((state) => {
            state.userInfo.searches.preferences.lastSearch = searchStr;
        }, false, {type: 'updateLastSearch'});
   }
}), { name: 'user-info'}), {name: 'user-preferences', storage: createJSONStorage(() => sessionStorage)})));

export default useUserInfoStore;