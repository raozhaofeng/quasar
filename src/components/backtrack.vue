<template>
    <div>
        <q-toolbar :style='toolbarStyle' class='no-padding bg-primary text-white'>
            <q-btn flat icon='arrow_back_ios' color='white' size="md" @click='backFunc'></q-btn>
            <q-toolbar-title class='text-center'>{{ title }}</q-toolbar-title>
            <q-btn flat :label='moreObject.label' :icon-right="moreObject.icon" color="white" class="text-body1"
                   @click='moreObject.click'></q-btn>
        </q-toolbar>
    </div>
</template>

<script lang='ts'>
import Router from 'src/router';

export default {
    name: 'ComponentsBacktrack',
    props: {
        toolbarStyle: {
            type: Object,
            default: () => {
                return {height: '60px'};
            }
        },
        title: {
            type: String
        },
        backUrl: {
            type: String,
            default: ''
        },
        moreObject: {
            type: Object,
            default: () => {
                return {
                    label: '', icon: '', click: () => {
                        console.log(1)
                    }
                }
            }
        }
    },
    setup(props: any) {
        // 返回按钮
        const backFunc = () => {
            props.backUrl === '' ? Router.back() : Router.push(props.backUrl)
        };

        return {
            backFunc,
        };
    }
};
</script>

<style scoped>

</style>
