import axios from 'axios';
import EnvConfig from 'config/EnvConfig';
import Cookies from 'js-cookie';
import exponentialBackoff from '../layouts/ecommerce/exponential backoff/backoff';
import { userRefreshToken } from './Services';
import { clearCookie } from '../layouts/ecommerce/Common/CommonFunction';

const instance = axios.create({
  baseURL: EnvConfig().baseConfigUrl,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});

const user = localStorage.getItem('user_name');
const userDetails = JSON.parse(localStorage.getItem('user_details'));

const postHeaders = {
  'Content-Type': 'application/json',
  USER: user,
  USER_ROLE: 'CLIENT',
  at: '',
  platform: 'RMS',

  //'Authorization': 'JWT fefege...'
};

const postRefrshHeaders = {
  'Content-Type': 'application/json',
  USER: user || 'NA',
  USER_ROLE: 'CLIENT',
  source: '',

  //'Authorization': 'JWT fefege...'
};
const postSubUserHeaders = {
  'Content-Type': 'application/json',
  USER: user,
  USER_ROLE: 'CLIENT',
  at: '',

  Authorization: 'Bearer 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',
};

const deleteHeaders = {
  'Content-Type': 'application/json',
  USER: user,
  USER_ROLE: 'CLIENT',
  at: '',

  //'Authorization': 'JWT fefege...'
};

const postHeaderss = {
  'Content-Type': 'application/json',
  USER: user,
  USER_ROLE: 'HANDLER',
  at: '',
  //'Authorization': 'JWT fefege...'
};

const postPdfHeaders = {
  'Content-Type': 'application/json',
  USER: user,
  USER_ROLE: 'HANDLER',
  Accept: 'application/pdf',
  at: '',
};
const getHeaders = {
  'Content-Type': 'application/json',
  USER: user,
  USER_ROLE: 'CLIENT',
  at: '',
  //'Authorization': 'JWT fefege...'
};
const patchHeaders = {
  'Content-Type': 'application/json',
  USER: user,
  USER_ROLE: 'CLIENT',
  at: '',
  //'Authorization': 'JWT fefege...'
};

const patchMultipartHeaders = {
  'Content-Type': 'multipart/form-data',
  USER: user,
  USER_ROLE: 'CLIENT',
  at: '',
  //'Authorization': 'JWT fefege...'
};

const postMultipartHeaders = {
  'Content-Type': 'multipart/form-data',
  USER: user,
  USER_ROLE: 'HANDLER',
  at: '',
  //'Authorization': 'JWT fefege...'
};

const postMultipartHeaders2 = {
  'Content-Type': 'multipart/form-data',
  name: user,
  uidx: userDetails?.uidx,
  USER_ROLE: 'HANDLER',
  at: '',
};

export const postPreAprrovedCoupons = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  const user = localStorage.getItem('user_name');

  return new Promise(function (resolve, reject) {
    axios
      .post(endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
          USER: user,
          USER_ROLE: 'CLIENT',
          at: at,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postpdfRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  return new Promise(function (resolve, reject) {
    axios
      .post(endpoint, data, { responseType: 'arraybuffer', headers: { ...postPdfHeaders, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getPdfRequest = (endpoint) => {
  const at = localStorage.getItem('access_token');
  return new Promise(function (resolve, reject) {
    axios
      .get(endpoint, { responseType: 'arraybuffer', headers: { ...postPdfHeaders, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postDownloadPdfRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  return new Promise(function (resolve, reject) {
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        at: at,
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postValidateRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  const apiCall = () => {
    return axios.post(endpoint, data, { headers: { ...postHeaders, at: at, platform: 'RMS' } });
  };

  return exponentialBackoff(apiCall)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err?.response?.data === 'Rate exceeded.') {
        throw new Error('Rate exceeded.');
      } else if (err?.response?.data?.message === 'UnAuthorized Token') {
        if (localStorage.getItem('refresh_token')) {
          userRefreshToken()
            .then((res) => {
              localStorage.setItem('access_token', res?.data?.data?.at);
              localStorage.setItem('refresh_token', res?.data?.data?.rt);
              setCookie('access_token', res?.data?.data?.at, { path: '/' });
              setCookie('refresh_token', res?.data?.data?.rt, { path: '/' });
              sessionStorage.setItem('access_token', res?.data?.data?.at);
            })
            .catch((err) => {
              if (err?.response?.data?.message == 'UNAUTHORIZED RT');
              localStorage.clear();
              clearCookie('access_token');
              clearCookie('refresh_token');
              window.location.href = '/';
            });
        } else {
          localStorage.clear();
          clearCookie('access_token');
          clearCookie('refresh_token');
          window.location.href = '/';
        }
      } else {
        throw err;
      }
    });
};

export const postValidateLogOutRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  const rt = localStorage.getItem('refresh_token');
  const apiCall = () => {
    return axios.post(endpoint, data, { headers: { ...postHeaders, at: at, rt: rt, platform: 'RMS' } });
  };

  return exponentialBackoff(apiCall)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err?.response?.data === 'Rate exceeded.') {
        throw new Error('Rate exceeded.');
      } else if (err?.response?.data?.message === 'UnAuthorized Token') {
        if (localStorage.getItem('refresh_token')) {
          userRefreshToken()
            .then((res) => {
              localStorage.setItem('access_token', res?.data?.data?.at);
              localStorage.setItem('refresh_token', res?.data?.data?.rt);
              setCookie('access_token', res?.data?.data?.at, { path: '/' });
              setCookie('refresh_token', res?.data?.data?.rt, { path: '/' });
              sessionStorage.setItem('access_token', res?.data?.data?.at);
            })
            .catch((err) => {
              if (err?.response?.data?.message == 'UNAUTHORIZED RT');
              localStorage.clear();
              clearCookie('access_token');
              clearCookie('refresh_token');
              window.location.href = '/';
            });
        } else {
          localStorage.clear();
          clearCookie('access_token');
          clearCookie('refresh_token');
          window.location.href = '/';
        }
      } else {
        throw err;
      }
    });
};

export const postRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  const apiCall = () => {
    return axios.post(endpoint, data, { headers: { ...postHeaders, at: at } });
  };

  return exponentialBackoff(apiCall)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err?.response?.data === 'Rate exceeded.') {
        throw new Error('Rate exceeded.');
      } else if (err?.response?.data?.message === 'UnAuthorized Token') {
        if (localStorage.getItem('refresh_token')) {
          userRefreshToken()
            .then((res) => {
              localStorage.setItem('access_token', res?.data?.data?.at);
              localStorage.setItem('refresh_token', res?.data?.data?.rt);
              setCookie('access_token', res?.data?.data?.at, { path: '/' });
              setCookie('refresh_token', res?.data?.data?.rt, { path: '/' });
              sessionStorage.setItem('access_token', res?.data?.data?.at);
            })
            .catch((err) => {
              if (err?.response?.data?.message == 'UNAUTHORIZED RT');
              localStorage.clear();
              clearCookie('access_token');
              clearCookie('refresh_token');
              window.location.href = '/';
            });
        } else {
          localStorage.clear();
          clearCookie('access_token');
          clearCookie('refresh_token');
          window.location.href = '/';
        }
      } else {
        throw err;
      }
    });
};

export const loginPostRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  const apiCall = () => {
    return axios.post(endpoint, data, { headers: { ...postHeaders } });
  };

  return exponentialBackoff(apiCall)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err?.response?.data === 'Rate exceeded.') {
        throw new Error('Rate exceeded.');
      } else if (err?.response?.data?.message === 'UnAuthorized Token') {
        if (localStorage.getItem('refresh_token')) {
          userRefreshToken()
            .then((res) => {
              localStorage.setItem('access_token', res?.data?.data?.at);
              localStorage.setItem('refresh_token', res?.data?.data?.rt);
              setCookie('access_token', res?.data?.data?.at, { path: '/' });
              setCookie('refresh_token', res?.data?.data?.rt, { path: '/' });
              sessionStorage.setItem('access_token', res?.data?.data?.at);
            })
            .catch((err) => {
              if (err?.response?.data?.message == 'UNAUTHORIZED RT');
              localStorage.clear();
              clearCookie('access_token');
              clearCookie('refresh_token');
              window.location.href = '/';
            });
        } else {
          localStorage.clear();
          clearCookie('access_token');
          clearCookie('refresh_token');
          window.location.href = '/';
        }
      } else {
        throw err;
      }
    });
};

export const postOrgRequest = (endpoint, data, palletOrgId) => {
  const at = localStorage.getItem('access_token');
  let org_id = palletOrgId === true ? 'PALLET' : localStorage.getItem('orgId');

  if (!org_id) {
    org_id = 'PALLET';
  }

  return new Promise(function (resolve, reject) {
    const maxRetries = 3;
    const initialDelay = 1000;
    let currentRetries = 0;
    let currentDelay = initialDelay;
    const makeRequest = () => {
      axios
        .post(endpoint, data, { headers: { ...postHeaders, at: at, org_id: org_id } })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err?.response?.data === 'Rate exceeded.' && currentRetries < maxRetries) {
            setTimeout(() => {
              currentRetries++;
              currentDelay *= 2;
              makeRequest();
            }, currentDelay);
          } else {
            reject(err);
          }
        });
    };
    makeRequest();
  });
};

export const postSubUserRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');

  return new Promise(function (resolve, reject) {
    const maxRetries = 3;
    const initialDelay = 1000;
    let currentRetries = 0;
    let currentDelay = initialDelay;
    const makeRequest = () => {
      axios
        .post(endpoint, data, { headers: { ...postSubUserHeaders, at: at } })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err?.response?.data === 'Rate exceeded.' && currentRetries < maxRetries) {
            setTimeout(() => {
              currentRetries++;
              currentDelay *= 2;
              makeRequest();
            }, currentDelay);
          } else {
            reject(err);
          }
        });
    };
    makeRequest();
  });
};

export const postRTRequest = (endpoint, data) => {
  const rt = localStorage.getItem('refresh_token');
  const deviceType = localStorage.getItem('deviceType');
  const orgId = localStorage.getItem('orgId');
  const platform = deviceType === 'mobile' ? 'B2B' : 'RMS';

  return new Promise(function (resolve, reject) {
    const maxRetries = 3;
    const initialDelay = 1000;
    let currentRetries = 0;
    let currentDelay = initialDelay;
    const makeRequest = () => {
      axios
        .post(endpoint, data, {
          headers: { ...postRefrshHeaders, rt: rt, source: orgId ? orgId : 'NA', platform: platform },
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err?.response?.data === 'Rate exceeded.' && currentRetries < maxRetries) {
            setTimeout(() => {
              currentRetries++;
              currentDelay *= 2;
              makeRequest();
            }, currentDelay);
          } else {
            reject(err);
          }
        });
    };
    makeRequest();
  });
};

export const deleteRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');

  return new Promise(function (resolve, reject) {
    axios
      .delete(endpoint, { headers: { ...deleteHeaders, at: at }, data: data })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postquoteRequests = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  return new Promise(function (resolve, reject) {
    axios
      .post(endpoint, data, { headers: { ...postHeaderss, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const putRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  return new Promise(function (resolve, reject) {
    axios
      .put(endpoint, data, { headers: { ...postHeaders, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const gettRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');

  const setCookie = (key, value, options) => {
    Cookies.set(key, value, options);
  };

  const apiCall = () => {
    return axios.get(endpoint, { headers: { ...getHeaders, at: at } });
  };

  return exponentialBackoff(apiCall)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err?.response?.data?.message === 'UnAuthorized Token') {
        if (localStorage.getItem('refresh_token')) {
          userRefreshToken()
            .then((res) => {
              localStorage.setItem('access_token', res?.data?.data?.at);
              localStorage.setItem('refresh_token', res?.data?.data?.rt);
              setCookie('access_token', res?.data?.data?.at, { path: '/' });
              setCookie('refresh_token', res?.data?.data?.rt, { path: '/' });
              sessionStorage.setItem('access_token', res?.data?.data?.at);
            })
            .catch((err) => {
              if (err?.response?.data?.message == 'UNAUTHORIZED RT');
              localStorage.clear();
              clearCookie('access_token');
              clearCookie('refresh_token');
              window.location.href = '/';
            });
        } else {
          localStorage.clear();
          clearCookie('access_token');
          clearCookie('refresh_token');
          window.location.href = '/';
        }
      } else {
        throw err;
      }
    });
};

export const pdfgetRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  return new Promise(function (resolve, reject) {
    fetch(endpoint, { headers: { ...getHeaders, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postFileRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');

  return new Promise(function (resolve, reject) {
    axios
      .post(endpoint, data, { headers: { ...postMultipartHeaders, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postFileRequest2 = (endpoint, data) => {
  const at = localStorage.getItem('access_token');

  return new Promise(function (resolve, reject) {
    axios
      .post(endpoint, data, { headers: { ...postMultipartHeaders2, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const patchMultipartRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  return new Promise(function (resolve, reject) {
    axios
      .patch(endpoint, data, { headers: { ...patchMultipartHeaders, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const patchRequest = (endpoint, data) => {
  const at = localStorage.getItem('access_token');
  return new Promise(function (resolve, reject) {
    axios
      .patch(endpoint, data, { headers: { ...patchHeaders, at: at } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postTallyRequest = (url, data) => {
  return new Promise(function (resolve, reject) {
    axios
      .post(url, data, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default gettRequest;
