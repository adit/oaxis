import axios from 'axios';
import Base64 from 'js-base64';
import qs from 'qs';

class RequestError extends Error {
  constructor(error) {
    super(error.response?.data.error_message || error.code);
    this.name = 'RequestError';
    this.status = error.response?.status || error.errno;
  }
}

class Request {
  axiosConfig = {
    headers: {
      'x-app-version': '7.4.0',
      'content-type': 'application/x-www-form-urlencoded',
      'User-Agent': 'okhttp/3.14.4',
    },
    decompress: true,
  };

  constructor(auth) {
    this.axiosConfig.headers['Authorization'] = auth;
  }

  async get(apiURL) {
    try {
      const result = await axios.get(apiURL, this.axiosConfig);

      return result.data;
    } catch (error) {
      if (error.isAxiosError) throw new RequestError(error);
      throw error;
    }
  }

  async post(apiURL, content) {
    try {
      // Stringify content
      let postContent = JSON.stringify(content);

      postContent = qs.stringify({
        content: Base64.encode(postContent),
      });

      const result = await axios.post(apiURL, postContent, this.axiosConfig);

      return result.data;
    } catch (error) {
      if (error.isAxiosError) throw new RequestError(error);
      throw error;
    }
  }
}

export { Request, RequestError };
