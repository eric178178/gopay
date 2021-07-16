
set nocompatible "不与 Vi 兼容
let mapleader = ','
set nobackup
set noswapfile
autocmd BufWritePost $MYVIMRC source $MYVIMRC "保存自动刷新配置
syntax on "打开语法高亮
set showmode "在底部显示命令模式还是插入模式
set encoding=utf-8
set laststatus=2 "总是显示状态行
set tabstop=2 "tab宽度为2
set shiftwidth=2
set expandtab "用空格代替tab
syntax enable
set t_Co=256
colorscheme molokai
inoremap <C-L> <Right>
inoremap <C-H> <Left>
inoremap <C-J> <Down>
inoremap <C-K> <Up>
:set number
" 普通模式按空格键插入一个空格
nnoremap <Space> i <ESC>
nmap <tab> V>
nmap <s-tab> V<
vmap <tab> >gv
vmap <s-tab> <gv
filetype off 
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'
Plugin 'Lokaltog/vim-easymotion'
call vundle#end()
filetype on
