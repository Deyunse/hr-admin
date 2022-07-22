<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <RoleManage></RoleManage
          ></el-tab-pane>
          <el-tab-pane label="公司设置" name="second"
            ><CompanyForm></CompanyForm>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import RoleManage from './components/RoleManage'
import CompanyForm from './components/CompanyForm'
export default {
  filters: {},
  components: { RoleManage, CompanyForm },
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
