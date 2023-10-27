import { useUserStore } from '~/stores/user'


export const useFetchAuth = (url, opts) => {
    const { user } = useUserStore();

    // timeout: 30000
    const headers = {
      ...(opts?.headers || {}),
      ...(user.token && { Authorization: `Token ${user.token}` }),
    };

    return $fetch(url, { ...opts, headers });
  };