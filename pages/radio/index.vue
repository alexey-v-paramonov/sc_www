<template>
  <v-container>
    <v-row no-gutters md="12">
      <v-col><div class="text-h5">{{ $t('radios.self_hosted.title') }}</div></v-col>
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
            <td>{{ item.name }}</td>
            <td>{{ item.calories }}</td>
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
  </v-container>
</template>
  
<script setup>

definePageMeta({
  layout: "default",
});

</script>
