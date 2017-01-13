#!/usr/bin/python
## get subprocess module 
import subprocess
import time


## Call keypair create command ##
keyname = raw_input("Enter the KEYNAME to create a VM ")
key_command = "euca-create-keypair -f "+keyname+ " "+keyname
print key_command
p0 = subprocess.Popen(key_command, stdout=subprocess.PIPE, shell=True)
(output, err) = p0.communicate()
p_status = p0.wait()
print "Key created successfully"


## Call Instance create command ##
vm_command = "euca-run-instances -t m1.large -k "+keyname+" -n 1 ami-00001405"
p1 = subprocess.Popen(vm_command, stdout=subprocess.PIPE, shell=True)
(output, err) = p1.communicate()
p_status = p1.wait()
arg_list = output.split()
Instance_name = arg_list[5]
print "The Instance name is : ", Instance_name

time.sleep(120)
## Call describe instances command ## 
instance_command = "euca-describe-instances "+Instance_name
p2 = subprocess.Popen(instance_command, stdout=subprocess.PIPE, shell=True)
(output, err) = p2.communicate()
p_status = p2.wait()
arg_list = output.split()
IP_address = arg_list[-1]
print "The IP_address of VM is : ", IP_address

print "Copying the contents to the VM"
scp_command = "scp -i "+keyname+" myScript.sh graduate.sql root@"+IP_address+":/root/"
#scp_command = "scp -i key6 myScript.sh graduate.sql root@141.40.254.77:/root/"
print scp_command
p3 = subprocess.Popen(scp_command, stdout=subprocess.PIPE, shell=True)
(output, err) = p3.communicate()
p_status = p3.wait()

print "Executing commands on the new VM"
cmd1 = "ssh -i "+keyname+" root@"+IP_address+" '/root/myScript.sh'"
#cmd1 = "ssh -i key6 root@141.40.254.77 /root/myScript.sh"
print cmd1
p4 = subprocess.Popen(cmd1, stdout=subprocess.PIPE, shell=True)
(output, err) = p4.communicate()
p_status = p4.wait() 
print "Done"
