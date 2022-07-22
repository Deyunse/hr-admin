<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      @click="
        reloDialogVisible = true;
        isEdit = false;
        form = {};
      "
      >新增角色</el-button
    >
    <el-table :data="roleList" border>
      <el-table-column label="序号" type="index" width="160px">
      </el-table-column>
      <el-table-column label="角色名" width="160px" prop="name" sortable>
      </el-table-column>
      <el-table-column label="描述" prop="description" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRightDialog(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="text" @click="changeRole(scope.row)">修改</el-button>
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[1, 2, 3, 4, 5]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-row>
    <el-dialog title="分配权限" :visible.sync="rightVisible" width="50%">
      <!-- 只要是vue项目,当你出现一个很奇怪的问题的时候,可以试一试v-if或$nextTick,或者setTimeout 数据没有同步 -->
      <!-- v-if作用:保证每次对话框关闭的时候,让tree销毁,再显示对话框的时候,看到的tree是一个新的 -->
      <el-tree
        v-if="rightVisible"
        ref="myTree"
        :data="premissions"
        :props="{ label: 'name' }"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedPermissions"
      ></el-tree>
      <template #footer>
        <el-button type="primary" @click="putdate">确认</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增和编辑的对话框 -->
    <el-dialog
      :visible.sync="reloDialogVisible"
      :title="isEdit ? '修改角色' : '新增角色'"
      @close="reset"
    >
      <el-form ref="myForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确认</el-button>
        <el-button @click="reloDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranFerListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 默认拿第一页数据
        pagesize: 4 // 每页数量
      },
      roleList: [],
      total: null,
      rightVisible: false,
      premissions: [],
      selectedPermissions: [],
      id: null,
      reloDialogVisible: false,
      form: { // 添加角色表单
        name: '',
        description: ''
      }, rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }, isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () { this.getRoleList() },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      // console.log(res)
      this.roleList = res.rows
      this.total = res.total // 用于做分页
    }, handleCurrentChange (page) {
      this.paramsObj.page = page
      this.getRoleList()
    }, handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
    }, del (id) {
      this.$confirm('确定要删除吗？？？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.roleList === 1 && this.paramsObj.page !== 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }, async showRightDialog (id) {
      this.id = id
      // 获取所有权限
      const res = await getPermissions()
      this.premissions = tranFerListToTree(res, '0')
      // 获取点击的那一项的权限
      const res1 = await getPermissionsById(id)
      // console.log(res1)
      this.selectedPermissions = res1.permIds
      this.rightVisible = true
    }, async putdate () {
      // console.log(this.$refs.myTree.getCheckedKeys())
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.rightVisible = false
    }, onClick () {
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单校验失败')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          await addRole(this.form)
          // console.log(123)
        }
        this.getRoleList()
        this.reloDialogVisible = false
      })
    }, reset () { // 关闭对话框时 清空表单
      this.$refs.myForm.resetFields()
    },
    changeRole (row) {
      this.isEdit = true
      this.reloDialogVisible = true
      this.form = { ...row } // 浅拷贝
      // this.form = Object.assign({}, row) // 浅拷贝
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
