<template>
  <v-container>
    <!-- SELF Hosted list -->
    <v-row no-gutters md="12">
      <v-col>
        <div class="text-h5">{{ $t('radios.self_hosted.title') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('radios.self_hosted.server') }}
              </th>
              <th class="text-left">
                {{ $t('radios.self_hosted.radios_num') }}
              </th>
              <th class="text-left">
                {{ $t('radios.self_hosted.status') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.ip }}</td>
              <td>{{ item.radios_num }}</td>
            </tr>
            <tr v-if="!self_hosted_radios">
              <td class="text-center" colspan="3">
                <br />
                {{ $t('radios.self_hosted.empty') }}
                <br />
                <br />
                <v-btn color="primary" to="/radio/wizard" class="mt-2">{{ $t('radio.wizard') }}</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

    </v-row>
    
    <v-row>
      <v-col cols="12">
        <div class="pt-5 pb-5">
          <v-divider></v-divider>
        </div>
      </v-col>
    </v-row>
    

    <!-- Hosted list -->
    <v-row no-gutters md="12">
      <v-col>
        <div class="text-h5">{{ $t('radios.hosted.title') }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters md="12">
      <v-col>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('hosted.station_id') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.username }}</td>
            </tr>
            <tr v-if="!hosted_radios">
              <td class="text-center" colspan="3">
                <br />
                {{ $t('radios.hosted.empty') }}
                <br />
                <br />
                <v-btn color="primary" to="/radio/wizard" class="mt-2">{{ $t('radio.wizard') }}</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

    </v-row>

</v-container>
</template>
  
<script setup>

definePageMeta({
  layout: "default",
});

</script>
