<template>
<div>
<h4>signup</h4>
    <ValidationProvider rules="required|email" v-slot="{ errors }">
        <label class="col-xl-2 col-form-label">{{$t('email')}}</label>
        <input class="form-control" :class="{'is-invalid': errors.has('email')}"
            type="email" name="email" placeholder="email" v-model="signup.email">
        <span>{{ errors[0] }}</span>
    </ValidationProvider>
</div>
</template>

<script>
    import { ValidationProvider } from 'vee-validate';

    export default {
        components: {
            ValidationProvider
        },
        data() {
            return {
                signup: {
                    email: ''
                }
            }
        }
    };
</script>