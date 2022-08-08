<template>
  <div>
    <div class="card bg-light">
      <article class="card-body mx-auto" style="max-width: 400px;">
        <h4 class="card-title mt-3 text-center">{{$t('signup')}}</h4>
        <p class="text-center">Get started with your free account</p>
        <p>
          <a href class="btn btn-block btn-facebook">
            <fa :icon="['fab', 'facebook-f']"/>  Login via facebook
          </a>
        </p>
        <p class="divider-text">
          <span class="bg-light">OR</span>
        </p>
        <form>
          <!-- Email -->
          <div class="form-group input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <fa icon="envelope"/>
              </span>
            </div>
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <input
                name="email"
                class="form-control"
                :placeholder="$t('email')"
                type="email"
                v-model="signup.email"
              />
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <!-- Password -->
          <div class="form-group input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <fa icon="lock"/>
              </span>
            </div>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <input
                name="password"
                class="form-control"
                :placeholder="$t('password')"
                type="password"
                v-model="signup.password"
              />
              <span>{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block">Create Account</button>
          </div>
          <p class="text-center">
            Have an account?
            <a href>Log In</a>
          </p>
        </form>
      </article>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
// https://bootsnipp.com/snippets/z8699
export default {
  components: {
    ValidationProvider
  },
  data() {
    return {
      signup: {
        email: "",
        password: ""
      }
    };
  }
};
</script>

<style scoped>
.divider-text {
  position: relative;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
.divider-text span {
  padding: 7px;
  font-size: 12px;
  position: relative;
  z-index: 2;
}
.divider-text:after {
  content: "";
  position: absolute;
  width: 100%;
  border-bottom: 1px solid #ddd;
  top: 55%;
  left: 0;
  z-index: 1;
}

.btn-facebook {
  background-color: #405d9d;
  color: #fff;
}
.btn-twitter {
  background-color: #42aeec;
  color: #fff;
}
</style>