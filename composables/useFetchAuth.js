import { useUserStore } from '~/stores/user'
import { useUiStateStore } from '@/stores/ui'


export async function useFetchAuth(url, opts) {

  const { user } = useUserStore();
    const stateUI = useUiStateStore();

    let response;
    stateUI.setLoading(true);
    // timeout: 30000
    const headers = {
      ...(opts?.headers || {}),
      ...(user.token && { Authorization: `Token ${user.token}` }),
    };
    try{
      response = await useFetch(url, { ...opts, headers });
    }
    catch(e){
      throw e;
    }
    finally{
      stateUI.setLoading(false);
    }
    
    return response;
  };