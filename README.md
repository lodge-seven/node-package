# node-packge
node包，主要是深入浅出node的一些事例说明

龙77学习git心得_(:зゝ∠)_
    从github上拉取一个版本库，会在相应的文件夹里带有git隐藏文件夹，vsc打开，调用插件git history进行查询分支情况。
    文件夹与文件的命名不能为中文，在git窗口会乱码。
    .gitignore 忽略文件夹

# 1 git说明：
    git是一个版本控制系统，用的是分布式（版本库分布，对本机文件通过交换更新，不主动影响其余版本库。可有特定版本库作为中央服务器用来规划本机版本是否为各个版本库最新/公认版本，避免多重交换更新）。
    不需联网，安全性高
    * repository 仓库

# 2 使用工具：
    git bash，Windows下的命令行工具
    git Gui，图形化界面

# 3 本地入门资料（基础）:
    ** 1 本地创建并初始化新git仓库/版本库 
   
    进入想要创建版本库的目录 cd F:\node包\

    创建一个新文件夹 mkdir new_folder

    清空窗口命令 clear

    查看git状态 git status
    * 有多种情况及下一步建议 
        =====1
        * 暂存区没有文件，对工作区文件修改时，可以撤销/添加暂存：
        Change not staged for commit:
        (use "git add <file>..." to update what will be committed)
        (use "git checkout -- <file...> to discard changes in working directory")

        =====2
        * 文件/文件夹添加到暂存区，没有做修改时，可以提交/清空暂存：
        Change to be commited:
        (use "git reset HEAD <file> ..." to unstage)

        =====3
        * 当暂存区没有，工作区有的文件（新增或者移出暂存区的文件）时，可以添加到暂存/忽视文件：
        Untracked files:
        (use "git add <file>..." to include in what will be committed)
 
        =====4
        * 文件添加到暂存区，工作区做了修改时（修改文件后没有再次添加暂存），可以撤销/再次添加暂存：
        Changes not staged for commit:
        (use "git add <file>..." to update what will be committed)
        (use "git checkout -- <file>..." to discard changes in working directory)
        ** 注：每次修改完，确定不会二次更改，最好添加到暂存。运行撤销会还原到之前暂存区的状态，白改。        

    首次进要先初始化git仓库 在目录下生成.git文件夹 git init
    * 此时提示 Initialized empty Git repository in F:/node包/.git/
    * 初始化完成 首页多出一个.git文件夹（如果没有找到可通过 ls -ah 查看）
    * 这个node包文件夹下的所有文件都可以放入仓库中了 但现在git仓库是空的

    ** 2 本地暂存与取消

    仓库暂存/添加所有文件 git add .

    仓库暂存/添加指定文件 git add <file>
    * 暂存区（stage/index）：git自动创建分支master，指向master的指针HEAD
    * 之前没有被添加到暂存区的文件/文件夹，状态为未记录（Untracked files: 文件/文件夹）
    * 在暂存区，之后被修改过的文件，状态为修改记录（modified: 修改文件）

    仓库暂存区取消所添加的async文件夹内所有文件 git rm --cached async/\*

    仓库暂存区全部清除 git rm --cached -r . -f

    仓库暂存区取消指定文件 git rm --cached <file>
    * rm 删除文件 --cached 暂存区
    
    ** 3 查看更改状况
    暂存区文件修改与未修改对比 git diff

    工作区与版本库最新版本的区别 git diff HEAD -- <file>

    查看文件中的所有内容 cat <file>

    ** 4 提交文件到当前分支

    提交文件到当前分支 git commit -m "标题"
