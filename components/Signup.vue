<template>
<div>
<h4>signup</h4>
<label class="col-xl-2 col-form-label">{{$t('email')}}</label>
<input class="form-control" :class="{'is-invalid': errors.has('email')}"
    type="email" name="email" placeholder="email" v-validate="'required|email'" v-model="signup.email">

</div>
</template>

<script>
    export default {
        data() {
            return {
                signup: {
                    email: ''
                }
            }
        }
    };
</script>