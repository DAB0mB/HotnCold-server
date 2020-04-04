import mergeDeep from 'merge-deep';
import fetch from 'node-fetch';
import * as qs from 'qs';

class Meetup {
  constructor(consumer, user) {
    this.consumer = consumer;
    this.user = user;
  }

  async getOAuthToken() {
    if (this.oAuthToken && this.oAuthExpires > new Date()) return this.oAuthToken;

    const res = {};

    {
      const query = qs.stringify({
        client_id: this.consumer.key,
        redirect_uri: this.consumer.redirectUri,
        response_type: 'anonymous_code',
      });

      res.auth = await fetch(`https://secure.meetup.com/oauth2/authorize?${query}`, {
        headers: {
          'Accept': 'application/json',
        },
      }).then(res => res.json());
    }

    {
      const query = qs.stringify({
        client_id: this.consumer.key,
        client_secret: this.consumer.secret,
        redirect_uri: this.consumer.redirectUri,
        code: res.auth.code,
        grant_type: 'anonymous_code',
      });

      res.access = await fetch(`https://secure.meetup.com/oauth2/access?${query}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${res.auth.code}`,
          'Accept': 'application/json',
        },
      }).then(res => res.json());
    }

    {
      const query = qs.stringify({
        email: this.user.email,
        password: this.user.password,
      });

      // For now we call operations that require user credentials as context but it's
      // better to avoid it when possible in the future
      res.user = await fetch(`https://api.meetup.com/sessions?${query}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${res.access.access_token}`,
          'Accept': 'application/json',
        },
      }).then(res => res.json());
    }

    this.oAuthToken = res.user.oauth_token;
    this.oAuthExpiresAt = new Date(Date.now() + 1000 * res.user.expires_in);

    return this.oAuthToken;
  }

  async callApi(url, options) {
    const oAuthToken = await this.getOAuthToken();

    return fetch(`https://api.meetup.com/${url}`, mergeDeep({
      headers: {
        'Authorization': `Bearer ${oAuthToken}`,
        'Accept': 'application/json',
      },
    }, options));
  }

  getUpcomingEvents(params = {}) {
    // lon,lat are mandatory otherwise we will retrieve data in relation to the user in context
    // which is completely irrelevant
    if (typeof params.lon != 'number') {
      throw TypeError('Meetup.getUpcomingEvents is missing params.lon');
    }

    if (typeof params.lat != 'number') {
      throw TypeError('Meetup.getUpcomingEvents is missing params.lat');
    }

    const query = qs.stringify(params);

    return this.callApi(`find/upcoming_events?${query}`).then(res => res.json());
  }

  getEvent(urlname, eventId, params = {}) {
    if (typeof urlname != 'string') {
      throw TypeError('Meetup.getEvent is missing urlname');
    }

    if (typeof eventId != 'string') {
      throw TypeError('Meetup.getEvent is missing eventId');
    }

    const query = qs.stringify(params);

    return this.callApi(`${urlname}/events/${eventId}?${query}`).then(res => res.json());
  }
}

export default Meetup;
