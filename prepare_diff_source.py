# -*- coding: utf-8 -*-
import os, sys, hashlib, re

def is_safe_name(fn): #qq
	ddfe = fn.find('"') == -1 and fn.find("'") == -1 and fn.find("`") == -1
	if not ddfe:
		print "WRONG NAME: "+fn
	return ddfe

def copy_itm(pl1, dff, rrr=False): #qq
	rr = ''
	if rrr:
		rr = '-R'
	if is_safe_name(pl1) and is_safe_name(dff):
		shell_exec('cp '+rr+' "'+pl1+'" "'+dff+'"')

def pull_and_get_commithashes(path_, github_id, project_id): #qq
	ddd = []
	if is_safe_name(path_) and is_safe_name(github_id) and is_safe_name(project_id):
		code = ""
		code += 'cd "'+path_+'";'
		code += 'git clone "https://github.com/'+github_id+'/'+project_id+'.git/";'
		code += "cd `ls`; git config pager.diff false; git config --global core.pager cat; git log | grep '^commit';"
		ddd = shell_exec(code).split('\n')
	return ddd

def getHomePath(): #qq
	return shell_exec('cd ~;pwd').strip()

def rmItem(path): #qq
	if is_safe_name(path):
		shell_exec('rm -rf "'+path+'"')

def genRandom(): #qq
	return shell_exec("openssl rand -base64 32 | md5").strip()

def list_files(compare_dir): #qq
	ddd = []
	if is_safe_name(compare_dir):
		ddd = shell_exec('ls "'+compare_dir+'"').strip().split('\n')
	return ddd

def git_checkout(path, hashkey): #qq
	if is_safe_name(path) and is_safe_name(hashkey):
		shell_exec('cd "'+path+'";git checkout "'+hashkey+'"')

def moveItm(bpp, cdc, path=''): #qq
	if is_safe_name(bpp) and is_safe_name(cdc):
		if len(path) > 0:
			if is_safe_name(path):
				shell_exec('cd "'+path+'";mv "'+bpp+'" "'+cdc+'"')
		else:
			shell_exec('mv "'+bpp+'" "'+cdc+'"')

def shell_exec(cmd):
	cmd_ = os.popen(cmd)
	result = ''
	if cmd_:
		result = cmd_.read()
		cmd_.close()
	return result.strip()

def is_dir(path):
	return os.path.isdir(path)

def is_file(path):
	return os.path.isfile(path)

def md5file(fname):
   if not is_file(fname):
	   return None
   hash_md5 = hashlib.md5()
   size_ = 128 * hash_md5.block_size
   with open(fname, "rb") as f:
      for chunk in iter(lambda: f.read(size_), b""):
         hash_md5.update(chunk)
   return hash_md5.hexdigest()

def get_script_name():
	return sys.argv[0]

def genPath(desirePath):
   try:
      os.makedirs(desirePath)
   except Exception as e:
      pass

def is_num(val):
	try:
		int(val)
		return True
	except Exception as e:
		return False

def compare_two_sources(compare_dir, nMode=False):
	compare_dir = os.path.abspath(compare_dir)+'/'
	if is_dir(compare_dir):
		fde = list_files(compare_dir)
		if False:
			for nm in fde:
				print nm
		if len(fde) == 2:
			cnt = 0
			tail = '_'
			if not nMode:
				tail += genRandom()
			for nn in fde:
				scan_path = compare_dir+nn
				for root, dirs, files in os.walk(scan_path):
					for file in files:
						filepath = str(root+'/'+file)
						pppth = filepath[len(scan_path):len(filepath)]
						pth1 = (compare_dir+fde[cnt])
						pth2 = (compare_dir+fde[0])
						if cnt == 0:
							pth2 = (compare_dir+fde[cnt+1])
						pl1 = pth1+pppth
						pl2 = pth2+pppth
						oo_p1=pth1+tail+'/'
						if not is_dir(oo_p1):
							genPath(oo_p1)
						md1 = md5file(pl1)
						md2 = md5file(pl2)
						if not (md1 and md2 and (md1==md2)):
							dff = oo_p1+(pppth.replace('/','／'))
							copy_itm(pl1, dff)
				cnt+=1
# -------------------------------------
# $ git credential-osxkeychain erase
# host=github.com
# protocol=https
# <press return>
# -------------------------------------
if len(sys.argv) == 2:
	path = os.path.abspath(sys.argv[1])
	if is_dir(path):
		compare_two_sources(path)
	sys.exit()

current_path = getHomePath()
base_path = current_path+'/.tmp_work_for_git_'+genRandom()
compare_dir = current_path+'/Downloads/GITHUB_PROJECT_COMPARE/'
if len(sys.argv) >= 5:
	github_id = sys.argv[1]
	if is_num(sys.argv[3]):
		compare_lst = [int(sys.argv[3]),int(sys.argv[4])]
		compare_local = False
	else:
		compare_lst = [sys.argv[3],int(sys.argv[4])]
		compare_local = os.path.abspath(sys.argv[3])
		if not is_dir(compare_local):
			compare_lst = [0,int(sys.argv[4])]
			compare_local = False

	project_id = sys.argv[2]
	random_str = genRandom()
	path_ = base_path+"/"+random_str
	rmItem(base_path)
	genPath(path_)

	list_ = pull_and_get_commithashes(path_, github_id, project_id)
	rmItem(compare_dir)
	genPath(compare_dir)
	cnt = 0
	ffwe = compare_lst
	if not is_num(ffwe[0]):
		ffwe = [0, ffwe[1]]
	for no in ffwe:
		if len(list_) > no and list_[no].find(' ') > -1:
			cnt += 1
			kks = list_[no].split(' ')[1]
			cl = str(cnt)
			bpc = base_path+"/"+cl
			cdc = compare_dir+"/"+cl
			copy_itm(path_, bpc, True)
			bpp = bpc+"/"+project_id
			git_checkout(bpp, kks)
			moveItm(bpp, cdc)
			rmItem(cdc+"/.git")
	cl = '1'
	cdc = compare_dir+'/'+cl
	if compare_local and is_dir(compare_local) and is_dir(cdc):
		rmItem(cdc)
		copy_itm(compare_local, cdc, True)		
		rmItem(cdc+'/.git')

	if cnt < 2:
		rmItem(compare_dir)
		print '-'*80
		print 'Index number of this project is out of range'
		print '-'*80
	else:
		compare_two_sources(compare_dir, True)
		for no in list_files(compare_dir):
			old_name = None
			new_name = None
			if no.find('_') != -1:
				old_name = no
				new_name = 'trimmed_'+(no.replace('_',''))+'_'
			else:
				old_name = no
				new_name = 'rawdata_'+no+'_'
			if old_name and new_name:
				moveItm(old_name, new_name, compare_dir)
		print '-'*80
		print 'Files are downloaded on '+compare_dir+'\n'
		for no in list_files(compare_dir):
			print compare_dir+no
		print '-'*80
	rmItem(base_path)
else:
	print '-'*80
	print 'python '+get_script_name()+' github_account_id project_id commit_number commit_number'
	print ''
	print 'github_account_id: github account id'
	print 'project_id: project name'
	print 'commit_number: if you give 0 then it means the first one of all commits'
	print 'commit_number: if you give 1 then it means the second one of all commits'
	print ''
	print '[Usage]'
	print '1. place '+get_script_name()+' file on your pc'
	print '2. turn on terminal app and type below'
	print '   python '+get_script_name()+' kstost PrepareDiffSource 0 1'
	print ''
	print '[How to compare with local]'
	print '   python '+get_script_name()+' kstost PrepareDiffSource /Users/kstost/Downloads/project 1'
	print '-'*80
