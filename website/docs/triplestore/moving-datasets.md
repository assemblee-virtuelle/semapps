---
title: Moving datasets
---

Fuseki use [sparse files](https://wiki.archlinux.org/title/Sparse_file) to store datasets. Basically it means datasets appear to take more space than what they are really taking.

If you want to move them to another server, you will need to ensure whatever method you use will take this into account, otherwise you may find yourself with 20-30 times more data than you initially had.

For example the `tar` tool has a `-S` option which will look if the files to compress are sparse files and, in that case, only bring into the archive the "real" part of the file. More information [here](https://www.gnu.org/software/tar/manual/html_node/sparse.html).

The `rsync` tool has a similar `-S` option which do the same. More information [here](https://gergap.wordpress.com/2013/08/10/rsync-and-sparse-files/).
