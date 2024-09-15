const stubs = {};

stubs.cpp = `#include<iostream>
#include<stdio.h>
using namespace std;

int main(){
  cout<<"Hello world!";
  return 0;
}
`;

stubs.py = `print("Hello World!")`;

export default stubs;
