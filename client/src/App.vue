<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body{
  height:722px;
  background:url(https://pic2.zhimg.com/80/v2-0687ae60cc782edf3d4d1d3ea53df40c_hd.jpg) no-repeat;
  background-size: cover;
  overflow: hidden;
}
 .center{
  width: 375px;
  height:350px;
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  margin:auto;
}
</style>
