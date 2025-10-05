#include<iostream>
#include<fstream>

using namespace std;

ifstream f("bifrunze1.in");
ofstream g("bifrunze1.out");

int v[5001];

struct nod{
    int val;
    nod *st, *dr;
};

int x,k;

nod *creare(){
    f>>x;
    if(x){
        nod *rad=new nod;
        rad->val=x;
        rad->st=creare();
        rad->dr=creare();
        return rad;
    }
    return nullptr;
}

void parcurgere(nod *rad){
    if(rad){
        if(rad->st==0 && rad->dr==0){
            v[++k]=rad->val;
        }
        parcurgere(rad->st);
        parcurgere(rad->dr);
    }
    
}
int main()
{
    nod *rad=creare();
    parcurgere(rad);
    for(int i=1;i<k;i++)
        for(int j=i+1;j<=k;j++)
            if(v[i]>v[j])
                swap(v[i],v[j]);
    for(int i=1;i<=k;i++)
        g<<v[i]<<' ';
    return 0;
}