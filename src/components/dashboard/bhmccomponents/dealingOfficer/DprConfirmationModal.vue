<template>     
    <div v-if="isOpen" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">       
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">         
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>         
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>         
        <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">           
          <div class="bg-white px-6 pt-6 pb-6 sm:p-6 sm:pb-6">             
            <div class="sm:flex sm:items-start">               
              <div class="w-full text-center sm:text-left">                 
                <h3 class="text-xl leading-6 font-semibold text-gray-900">                   
                  Confirm {{ actionType === 'approve' ? 'Approval' : 'Rejection' }}                 
                </h3>                 
                <div class="mt-4">                   
                  <p class="text-base text-gray-600">                     
                    Are you sure you want to {{ actionType }} this application?                   
                  </p>                 
                </div>                 
                <div class="mt-6">                   
                  <label for="message" class="block text-sm font-medium text-gray-700">Message:</label>                   
                  <textarea 
                    id="message" 
                    v-model="message" 
                    rows="3" 
                    class="mt-2 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm p-3"
                  ></textarea>                 
                </div>               
              </div>             
            </div>           
          </div>           
          <div class="bg-gray-50 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-3">             
            <button 
              type="button" 
              class="w-full sm:w-auto px-6 py-2.5 rounded-lg text-white font-medium text-sm shadow-sm transition-colors duration-200"
              :class="{
                'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2': actionType === 'approve',
                'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2': actionType === 'reject'
              }"
              @click="confirmAction"
            >               
              Confirm {{ actionType === 'approve' ? 'Approval' : 'Rejection' }}             
            </button>             
            <button 
              type="button" 
              class="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 px-6 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" 
              @click="close"
            >               
              Cancel             
            </button>           
          </div>         
        </div>       
      </div>     
    </div>   
  </template>      
  
  <script setup>   
  import { ref, defineProps, defineEmits } from 'vue';      
  
  const props = defineProps({     
    isOpen: Boolean,     
    actionType: String, // 'approve' or 'reject'     
    application: Object,   
  });      
  
  const emit = defineEmits(['close', 'confirm']);      
  const message = ref('');      
  
  const confirmAction = () => {     
    emit('confirm', props.application.id, message.value, props.actionType);   
  };      
  
  const close = () => {     
    emit('close');     
    message.value = ''; // Clear message when closing   
  };   
  </script>