import { useUserStore } from '~/stores/user'
import { useUiStateStore } from '@/stores/ui'
import { ref } from 'vue';


export async function useFetchAuth(url, opts) {

  const { user } =  useUserStore();
  const stateUI = useUiStateStore();
  const router = useRouter();
  const token = ref(user.token);
  
  let response;
  stateUI.setLoading(true);
  // timeout: 30000
  const headers = {
    ...(opts?.headers || {}),
    ...(token.value && { Authorization: `Token ${token.value}` }),
  };
  try {
    response = await useFetch(url, { ...opts, headers });
    if (response?.error?.value?.statusCode == 401) {
      router.push("/login");
    }
  }
  catch (e) {
    throw e;
  }
  finally {
    stateUI.setLoading(false);
  }

  return response;
};


export async function fetchAuth(url, opts) {

  const { user } =  useUserStore();
  const stateUI = useUiStateStore();
  const router = useRouter();
  const token = ref(user.token);
  
  let response;
  stateUI.setLoading(true);
  // timeout: 30000
  const headers = {
    ...(opts?.headers || {}),
    ...(token.value && { Authorization: `Token ${token.value}` }),
  };
  try {
    response = await $fetch(url, { ...opts, headers });
    if (response?.error?.value?.statusCode == 401) {
      router.push("/login");
    }
  }
  catch (e) {
    throw e;
  }
  finally {
    stateUI.setLoading(false);
  }

  return response;
};