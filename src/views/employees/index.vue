<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="提示消息">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel"
            >普通excel导出</el-button
          >
          <el-button type="info" size="mini" @click="exportExcel1"
            >复杂表头excel导出</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button type="primary" size="mini">新增员工</el-button>
        </template>
      </PageTool>
      <el-card style="margin-top: 10px">
        <el-table border :data="employees">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="姓名" sortable prop="username">
          </el-table-column>
          <el-table-column label="头像">
            <template v-slot="scope">
              <img v-imgerror :src="scope.row.staffPhoto" style="width: 40px" />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmploye"
          >
          </el-table-column>
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">{{
              scope.row.formOfEmployment | formatFornType
            }}</template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | dateformat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="formOfEmployment">
            <template v-slot="{ row }">
              <el-switch :value="row.formOfEmployment"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="360px" align="center">
            <template>
              <el-button type="text">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text">角色</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployee } from '@/api/employees'
import employees from '@/constant/employees'
export default {
  name: 'Employees',
  filters: {
    formatFornType (id) {
      var obj = employees.hireType.find(item => item.id === id - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === id - 0).value
      } else {
        return '为止'
      }
    }
  },
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        size: 5
      },
      employees: [],
      total: null
    }
  },
  computed: {},
  watch: {},
  created () { this.getEmployee() },
  methods: {
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      this.employees = res.rows
      this.total = res.total
    }, formatterEmploye (row, column, cellValue, idex) {
      var obj = employees.hireType.find(item => item.id === cellValue - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue - 0).value
      } else {
        return '未知'
      }
    },
    async exportExcel () {
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      console.log(rows)
      var data = []
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
        // 把列表进行加工变成 二维数组
        data.push(Object.values(item))
      })
      // console.log(data)
      // 映射为中文 map映射
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => (headers[item])) // 处理数据
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = ['编号', '姓名']
        // const data = [[1, '姓名'], [2, '李四']]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '德云社人力资源', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    exportExcel1 () {
      const multiHeader = [['', '主要信息', '', '', '', '', '']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
